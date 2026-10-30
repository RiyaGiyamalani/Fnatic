import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

// Import constants and utilities
import { SCHEDULED_LANGUAGES, DEFAULT_LANGUAGE_CODE } from '../src/constants/languages.js';
import { generateMockResponse } from '../src/utils/mockResponses.js';

test('1. Verify 22 Eighth Schedule Indian Languages list', () => {
  const expectedLanguages = [
    'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 'Hindi',
    'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam',
    'Manipuri (Meitei)', 'Marathi', 'Nepali', 'Odia', 'Punjabi',
    'Sanskrit', 'Santali', 'Sindhi', 'Tamil', 'Telugu', 'Urdu'
  ];

  assert.equal(SCHEDULED_LANGUAGES.length, 22, 'Must contain exactly 22 scheduled languages');

  expectedLanguages.forEach((langName) => {
    const found = SCHEDULED_LANGUAGES.find((item) => item.name === langName);
    assert.ok(found, `Language "${langName}" must be present in SCHEDULED_LANGUAGES`);
    assert.ok(found.code, `Language "${langName}" must have a code`);
    assert.ok(found.nativeName, `Language "${langName}" must have a nativeName`);
  });

  assert.equal(DEFAULT_LANGUAGE_CODE, 'hi', 'Default language must be Hindi');
});

test('2. Verify Mock Response generator for Government Schemes', () => {
  const query = 'पीएम किसान सम्मान निधि योजना के बारे में बताएं';
  const res = generateMockResponse(query, 'hi');

  assert.equal(res.sender, 'assistant');
  assert.equal(res.isMock, true, 'isMock flag must be true');
  assert.equal(res.category, 'Government Schemes');
  assert.match(res.source, /PM-Kisan/);
  assert.match(res.text, /नमूना उत्तर/);
});

test('3. Verify Mock Response generator for Agriculture & Crops', () => {
  const query = 'गेहूं की फसल में कीट रोग नियंत्रण';
  const res = generateMockResponse(query, 'mr');

  assert.equal(res.sender, 'assistant');
  assert.equal(res.isMock, true);
  assert.equal(res.category, 'Agriculture & Crops');
  assert.match(res.source, /ICAR/);
  assert.match(res.text, /Marathi/);
});

test('4. Verify Mock Response generator for Health Information', () => {
  const query = 'आयुष्मान भारत कार्ड से अस्पताल में इलाज कैसे कराएं?';
  const res = generateMockResponse(query, 'ta');

  assert.equal(res.sender, 'assistant');
  assert.equal(res.isMock, true);
  assert.equal(res.category, 'General Health Information');
  assert.match(res.source, /Ministry of Health and Family Welfare/);
  assert.match(res.text, /Tamil/);
});

test('5. Verify Mock Response generator for General queries', () => {
  const query = 'मौसम का हाल क्या है?';
  const res = generateMockResponse(query, 'bn');

  assert.equal(res.sender, 'assistant');
  assert.equal(res.isMock, true);
  assert.equal(res.category, 'General Rural Assistance');
  assert.match(res.text, /Bengali/);
});

test('6. Verify Frontend Production Build Assets exist', () => {
  const distHtml = path.join(frontendDir, 'dist', 'index.html');
  assert.ok(fs.existsSync(distHtml), 'dist/index.html must exist');

  const htmlContent = fs.readFileSync(distHtml, 'utf-8');
  assert.match(htmlContent, /Rural Sahayak/);
  assert.match(htmlContent, /ग्रामीण सहायक/);

  const assetsDir = path.join(frontendDir, 'dist', 'assets');
  assert.ok(fs.existsSync(assetsDir), 'dist/assets must exist');

  const assetFiles = fs.readdirSync(assetsDir);
  const jsBundle = assetFiles.find((f) => f.endsWith('.js'));
  const cssBundle = assetFiles.find((f) => f.endsWith('.css'));

  assert.ok(jsBundle, 'JavaScript production bundle must be generated');
  assert.ok(cssBundle, 'CSS production bundle must be generated');
});

test('7. Verify Component definitions and structure', () => {
  const components = [
    'Header.jsx',
    'LanguageSelector.jsx',
    'WelcomeBanner.jsx',
    'MessageItem.jsx',
    'LoadingIndicator.jsx',
    'ErrorBanner.jsx',
    'ChatInput.jsx'
  ];

  components.forEach((comp) => {
    const filePath = path.join(frontendDir, 'src', 'components', comp);
    assert.ok(fs.existsSync(filePath), `Component ${comp} must exist`);
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.length > 50, `Component ${comp} must not be empty`);
  });
});

