global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

process.env.AWS_REGION = process.env.AWS_REGION || 'us-east-1';
process.env.MENU_ITEMS_TABLE = process.env.MENU_ITEMS_TABLE || 'coffee-shop-api-dev-menu-items';

jest.setTimeout(10000);

console.log('Jest global setup loaded successfully');