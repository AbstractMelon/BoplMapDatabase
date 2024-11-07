const fs = require('fs');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

// Function to install dependencies
async function installDependencies(dependencies) {
    console.log('Installing project dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    if (dependencies.includes('frontend')) {
        execSync('cd ./frontend && npm install', { stdio: 'inherit' });
    }

    if (dependencies.includes('backend')) {
        execSync('cd ./backend && npm install', { stdio: 'inherit' });
    }
}

// Function to create the .env file
async function createEnvFile() {
    const responses = await inquirer.prompt([
        {
            type: 'input',
            name: 'deployToken',
            message: 'Enter your deploy token:',
        },
        {
            type: 'input',
            name: 'sessionSecret',
            message: 'Enter your session secret:',
        },
        {
            type: 'input',
            name: 'port',
            message: 'Enter the port for your backend (default: 3000):',
            default: '3000',
        },
        {
            type: 'input',
            name: 'cdn',
            message: 'Enter the CDN URL (default: none):',
            default: '',
        },
    ]);

    const envContent = `
# .env file for BopLMapDatabase

DEPLOY_TOKEN=${responses.deployToken}
SESSION_SECRET=${responses.sessionSecret}
PORT=${responses.port}
CDN=${responses.cdn}
`;

    fs.writeFileSync('.env', envContent);
    console.log('.env file has been created.');
}

// Main setup function
async function setup() {
    console.log('WELCOME TO THE INSTALLER');

    const { installDeps } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'installDeps',
            message: 'Do you want to install dependencies?',
            default: true,
        },
    ]);

    if (installDeps) {
        const { dependencies } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'dependencies',
                message: 'Select the dependencies to install:',
                choices: [
                    { name: 'All', value: 'all' },
                    { name: 'Frontend', value: 'frontend' },
                    { name: 'Backend', value: 'backend' },
                    { name: 'Docs', value: 'docs' }, // Assuming docs can also be installed separately
                ],
                validate: answer => {
                    if (answer.length < 1) {
                        return 'You must choose at least one dependency.';
                    }
                    return true;
                },
            },
        ]);

        const selectedDependencies = dependencies.includes('all')
            ? ['frontend', 'backend']
            : dependencies;

        await installDependencies(selectedDependencies);
    }

    await createEnvFile();
    console.log('Setup complete!');
}

// Run the setup
setup().catch(error => {
    console.error('Error during setup:', error);
});
