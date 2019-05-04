import * as _fs from 'fs';
import * as _path from 'path';

import Collection from './collection';

import { indexdbType } from './types';
import { createID } from './util';
import { resolve } from 'url';

export default class RayDB {
    indexdb: indexdbType;
    dir: string;

    constructor(path: string) {
        this.dir = _path.resolve(path);

        let cfPath: string = _path.resolve(`${this.dir}/.index.json`);

        if (!_fs.existsSync(this.dir)) {
            _fs.mkdirSync(this.dir);
            _fs.chmodSync(this.dir, '777');
            if (!_fs.existsSync(cfPath)) {
                _fs.writeFileSync(
                    cfPath,
                    JSON.stringify({
                        collections: [],
                    }),
                );
            }
        }

        this.indexdb = JSON.parse(_fs.readFileSync(cfPath).toString());
    }

    CreateCollection(name: string): Promise<Collection> {
        return new Promise((resolve, reject) => {
            let dirPath: string = _path.resolve(`${this.dir}/${name}`);

            if (!_fs.existsSync(dirPath)) {
                _fs.mkdirSync(dirPath);
                _fs.chmodSync(dirPath, '777');
            }

            let ID = createID(32),
                info = {
                    id: ID,
                    name: name,
                    path: dirPath,
                },
                cdb = this.indexdb.collections.find(i => i.path == dirPath);

            if (cdb == undefined) {
                this.indexdb.collections.push(info);
                this.SaveDB();
                console.log(`Novo collection foi criado: ${info.name}(${info.id})`);
            } else {
                info = {
                    id: cdb.id,
                    name: String(cdb.name),
                    path: String(cdb.path),
                };
            }

            let collection = new Collection(info.name, info.path);
            collection.info = info;

            resolve(collection);
        });
    }

    private SaveDB() {
        _fs.writeFileSync(_path.resolve(`${this.dir}/.index.json`), JSON.stringify(this.indexdb));
    }
}
