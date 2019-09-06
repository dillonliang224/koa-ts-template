import * as fs from 'fs';
import * as path from 'path';
import * as nconf from 'nconf';
import * as yaml from 'js-yaml';

nconf.use('memory');
nconf.env();

declare module 'nconf' {
    export interface IFormats {
        json: nconf.IFormat;
        ini: nconf.IFormat;
        yaml: nconf.IFormat;
    }
}

(nconf.formats as any).yaml = {
    stringify(obj: any, options: yaml.DumpOptions): string {
        return yaml.safeDump(obj, options);
    },
    parse(obj: string, options: yaml.LoadOptions): any {
        return yaml.safeLoad(obj, options);
    },
};

const CONFIG_DIR = process.env.CONFIG_DIR || path.join(__dirname, '../../../config');
const DEFAULT_ENV = process.env.NODE_ENV || 'development';

nconf.set('ABSOLUTE_CONFIG_DIR', path.join(__dirname, '..'));
nconf.defaults(yaml.safeLoad(fs.readFileSync(`${CONFIG_DIR}/default.yaml`, 'utf8')));

nconf.file('envfile', {
    type: 'file',
    file: `${CONFIG_DIR}/${DEFAULT_ENV}.yaml`,
    format: nconf.formats.yaml,
});

export default nconf;
