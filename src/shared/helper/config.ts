import * as config from 'config';

const API_PORT: number = config.get('app.api.port');
const DATABASE: any = config.get('database');

export { DATABASE, API_PORT };
