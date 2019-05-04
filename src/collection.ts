import * as _fs from 'fs';
import * as _path from 'path';

import Branch from './branch';

import { collectiondbType } from './types';
import { createID } from './util';

export default class Collection {
    collectiondb: collectiondbType;
    dir: string;
    info: object | undefined;

    constructor(name: string, dirPath: string) {
        this.dir = dirPath;

        let cfPath: string = _path.resolve(`${this.dir}/.index.json`);

        if (!_fs.existsSync(cfPath)) {
            _fs.writeFileSync(
                cfPath,
                JSON.stringify({
                    branches: [],
                }),
            );
        }

        this.collectiondb = JSON.parse(_fs.readFileSync(cfPath).toString());
    }

    AddFolderFromLink(path: string) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;

        if (!_fs.statSync(path).isDirectory()) {
            console.error("'path' não representa ser uma pasta");
            return;
        }

        let cdb = this.collectiondb.branches.find(i => i.path == path);
        if (cdb != undefined) {
            console.error(`'${cdb.name}' já existe.`);
            return;
        }

        let dirs: Array<string> = [],
            paths = _fs.readdirSync(path);

        for (let i = 0; i < paths.length; ++i) {
            let subpath = paths[i],
                stat = _fs.statSync(`${path}/${subpath}`);

            if (stat.isDirectory()) {
                dirs.push(_path.resolve(`${path}/${subpath}`));
            }
        }

        if (dirs.length <= 0) {
            console.error('Essa pasta não contém... nada?!');
            return;
        }

        let ID = createID(32),
            info = {
                id: ID,
                name: _path.parse(path).name,
                path: path,
            };

        this.collectiondb.branches.push(info);
        this.SaveDB();
        console.log(`Novo branch foi criado: ${info.name}(${info.id})`);

        let branch = new Branch(info.name, info.path);
        branch.info = info;

        for (let i = 0; i < dirs.length; ++i) {
            let dir = dirs[i];
            branch.AddFolderFromLink(dir);
        }
    }

    CreateBranch(name: string): Promise<Branch> {
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
                cdb = this.collectiondb.branches.find(i => i.path == dirPath);

            if (cdb == undefined) {
                this.collectiondb.branches.push(info);
                this.SaveDB();
                console.log(`Novo branch foi criado: ${info.name}(${info.id})`);
            } else {
                info = {
                    id: cdb.id,
                    name: String(cdb.name),
                    path: String(cdb.path),
                };
            }

            let branch = new Branch(info.name, info.path);
            branch.info = info;

            resolve(branch);
        });
    }

    getBranch(name: string) {
        let cdb = this.collectiondb.branches.find(i => i.id == name);
        if (cdb == undefined) {
            cdb = this.collectiondb.branches.find(i => i.path == _path.resolve(`${this.dir}/${name}`));
        }

        if (cdb == undefined) {
            console.error(`'${name}' não existe.`);
            return;
        }

        let info = {
            id: cdb.id,
            name: String(cdb.name),
            path: String(cdb.path),
        };

        let branch = new Branch(info.name, info.path);
        branch.info = info;

        return branch;
    }

    private SaveDB() {
        _fs.writeFileSync(_path.resolve(`${this.dir}/.index.json`), JSON.stringify(this.collectiondb));
    }
}
