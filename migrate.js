require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./src/config/database.js');

async function ensureHistoryTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS migrations_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL UNIQUE,
            run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}


async function migrateUp() {
    await ensureHistoryTable();

    const [rows] = await db.query('SELECT migration FROM migrations_history');
    const done = new Set(rows.map((r) => r.migration));

    const dir = path.join(__dirname, 'migrations');

    const files = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.up.sql'))
        .sort();
    console.log({ files });

    for (const file of files) {
        const base = file.replace('.up.sql', '');

        if (done.has(base)) {
            console.log(`SKIP (sudah dijalankan): ${file}`);
            continue;
        }

        console.log(`Menjalankan UP: ${file}`);

        const sql = fs.readFileSync(path.join(dir, file), 'utf8');

        try {
            await db.query(sql);
            await db.query('INSERT INTO migrations_history (migration) VALUES (?)', [base]);
            console.log(`✔ Sukses UP: ${file}`);
        } catch (err) {
            console.error(`✖ Error UP ${file}:`, err.message);
            process.exit(1);
        }
    }
    process.exit(0);
}


async function migrateDown() {
    await ensureHistoryTable();

    const [rows] = await db.query('SELECT migration FROM migrations_history ORDER BY id DESC LIMIT 1');

    if (rows.length === 0) {
        console.log('Tidak ada migration untuk di-rollback.');
        return;
    }

    const last = rows[0].migration;
    const file = `${last}.down.sql`;

    console.log(`Rollback DOWN: ${file}`);

    const filePath = path.join(__dirname, 'migrations', file);

    if (!fs.existsSync(filePath)) {
        console.error(`✖ File DOWN tidak ditemukan: ${file}`);
        return;
    }

    const sql = fs.readFileSync(filePath, 'utf8');

    try {
        await db.query(sql);
        await db.query('DELETE FROM migrations_history WHERE migration = ?', [last]);
        console.log(`✔ Sukses rollback: ${file}`);
        process.exit(0);
    } catch (err) {
        console.error(`✖ Error rollback ${file}:`, err.message);
        process.exit(1);
    }
}
async function migrateDownAll() {
    try {
        const [rows] = await db.query(`SELECT migration FROM migrations_history ORDER BY id DESC`);

        if (rows.length === 0) {
            console.log('Tidak ada migration yang perlu di-rollback.');
            process.exit(0);
        }

        console.log(`Total migration: ${rows.length}`);
        console.log('Menjalankan rollback ALL...\n');

        for (const row of rows) {
            const migrationName = row.migration;
            const downFile = path.join(__dirname, 'migrations', `${migrationName}.down.sql`);

            if (!fs.existsSync(downFile)) {
                console.error(`FILE DOWN TIDAK DITEMUKAN: ${migrationName}.down.sql`);
                continue;
            }

            const sql = fs.readFileSync(downFile, 'utf8');

            console.log(`Rollback: ${migrationName} ...`);
            await db.query(sql);

            await db.query(`DELETE FROM migrations_history WHERE migration = ?`, [migrationName]);
        }

        console.log('\nRollback ALL selesai.');
        process.exit(0);
    } catch (error) {
        console.error('Gagal rollback all:', error);
        process.exit(1);
    }
}


const cmd = process.argv[2];

if (cmd === 'up') {
    migrateUp();
} else if (cmd === 'down') {
    migrateDown();
} else if (cmd === 'downAll') {
    migrateDownAll();
} else {
    console.log('Gunakan:');
    console.log('  node migrate.js up');
    console.log('  node migrate.js down');
}
