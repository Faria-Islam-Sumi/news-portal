const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_SOURCE = path.join(__dirname, "portal.db");

console.log('Checking database at:', DB_SOURCE);

const db = new sqlite3.Database(DB_SOURCE, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('❌ Database does not exist or cannot be opened.');
        console.error('Error:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Database file exists and is accessible.');
        
        // Check users table
        db.all("SELECT * FROM users", [], (err, rows) => {
            if (err) {
                console.error('❌ Users table error:', err.message);
            } else {
                console.log(`\n📊 Users table: ${rows.length} users found`);
                rows.forEach(user => {
                    console.log(`   - ${user.name} (${user.email})`);
                });
            }
            
            // Check news table
            db.all("SELECT * FROM news", [], (err, rows) => {
                if (err) {
                    console.error('❌ News table error:', err.message);
                } else {
                    console.log(`\n📰 News table: ${rows.length} articles found`);
                    rows.forEach(news => {
                        console.log(`   - ${news.title}`);
                    });
                }
                
                db.close((err) => {
                    if (err) console.error('Error closing database:', err);
                    console.log('\n✅ Database check complete!');
                });
            });
        });
    }
});
