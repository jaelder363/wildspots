const { execSync } = require('child_process');
const path = require('path');

const openapiPath = path.resolve(__dirname, '../../docs/openapi.yaml');
const outputPath = path.resolve(__dirname, '../src/lib/api');

console.log('Generating API client...');
try {
  execSync(
    `npx @openapitools/openapi-generator-cli generate -i ${openapiPath} -g typescript-axios -o ${outputPath} --additional-properties=supportsES6=true,typescriptThreePlus=true,withInterfaces=true,useSingleRequestParameter=true,modelPropertyNaming=original`,
    { stdio: 'inherit' }
  );
  console.log('API client generated successfully!');
} catch (error) {
  console.error('Failed to generate API client:', error);
  process.exit(1);
}
