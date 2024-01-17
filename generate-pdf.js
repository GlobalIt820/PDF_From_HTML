const puppeteer = require('puppeteer');
const mysql = require('mysql');
const handlebars = require('handlebars');
const fs = require('fs');

// Database connection settings
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vallabhnagar',
};

const connection = mysql.createConnection(dbConfig);

const templatePath = 'template.hbs';

const templateHtml = fs.readFileSync(templatePath, 'utf8');

const sqlQuery = 'SELECT username FROM users WHERE id = 1';

const compiledTemplate = handlebars.compile(templateHtml);

connection.query(sqlQuery, (error, results) => {
    if (error) 
    {
        console.error('Error fetching data from the database:', error);
        connection.end();
        return;
    }

    const dynamicData = results[0];

    const htmlWithDynamicData = compiledTemplate(dynamicData);
    async function generatePDF()
    {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(htmlWithDynamicData);

        await page.pdf({
            path: 'output.pdf',
            format: 'A4',
        });

        await browser.close();
        console.log('PDF created successfully');
        connection.end();
    }

    generatePDF();
});
