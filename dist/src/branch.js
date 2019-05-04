"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs");
const _path = require("path");
const util_1 = require("./util");
class branch {
    constructor(_name, dirPath) {
        this.dir = dirPath;
        let cfPath = _path.resolve(`${this.dir}/.index.json`);
        if (!_fs.existsSync(cfPath)) {
            _fs.writeFileSync(cfPath, JSON.stringify({
                branches: [],
                files: [],
            }));
        }
        this.branchdb = JSON.parse(_fs.readFileSync(cfPath).toString());
    }
    AddFile(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isFile()) {
            console.error("'path' não representa ser um arquivo");
            return;
        }
        let cdb = this.branchdb.files.find(i => i.path == path);
        if (cdb != undefined) {
            console.error(`'${cdb.name}' já existe.`);
            return;
        }
        let ID = util_1.createID(32);
        const srcStat = _fs.statSync(path);
        _fs.chmodSync(this.dir, srcStat.mode);
        _fs.copyFileSync(path, this.dir + '/' + _path.parse(path).base);
        this.branchdb.files.push({
            id: ID,
            path: _path.resolve(this.dir + '/' + _path.parse(path).base),
            name: _path.parse(path).base,
        });
    }
    AddFolder(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isDirectory()) {
            console.error("'path' não representa ser uma pasta");
            return;
        }
        let cdb = this.branchdb.branches.find(i => i.path == path);
        if (cdb != undefined) {
            console.error(`'${cdb.name}' já existe.`);
            return;
        }
        let dirs = [], files = _fs.readdirSync(path);
        for (let i = 0; i < files.length; ++i) {
            let file = files[i], stat = _fs.statSync(`${path}/${file}`);
            if (stat.isFile()) {
                dirs.push(_path.resolve(`${path}/${file}`));
            }
        }
        if (dirs.length <= 0) {
            console.error('Essa pasta não contém arquivos');
            return;
        }
        let folder = this.CreateBranch(_path.parse(path).name);
        for (let i = 0; i < dirs.length; ++i) {
            let dir = dirs[i];
            folder.AddFile(dir);
        }
        this.SaveDB();
    }
    AddFileFromLink(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isFile()) {
            console.error("'path' não representa ser um arquivo");
            return;
        }
        let cdb = this.branchdb.files.find(i => i.path == path);
        if (cdb != undefined) {
            console.error(`'${cdb.name}' já existe.`);
            return;
        }
        let ID = util_1.createID(32);
        this.branchdb.files.push({
            id: ID,
            path: _path.resolve(path),
            name: _path.parse(path).base,
        });
    }
    AddFolderFromLink(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isDirectory()) {
            console.error("'path' não representa ser uma pasta");
            return;
        }
        let cdb = this.branchdb.branches.find(i => i.path == path);
        if (cdb != undefined) {
            console.error(`'${cdb.name}' já existe.`);
            return;
        }
        let dirs = [], files = _fs.readdirSync(path);
        for (let i = 0; i < files.length; ++i) {
            let file = files[i], stat = _fs.statSync(`${path}/${file}`);
            if (stat.isFile()) {
                dirs.push(_path.resolve(`${path}/${file}`));
            }
        }
        if (dirs.length <= 0) {
            console.error('Essa pasta não contém arquivos');
            return;
        }
        let ID = util_1.createID(32), info = {
            id: ID,
            name: _path.parse(path).name,
            path: path,
        };
        this.branchdb.branches.push(info);
        this.SaveDB();
        console.log(`Novo branch foi criado: ${info.name}(${info.id})`);
        let Branch = new branch(info.name, info.path);
        Branch.info = info;
        for (let i = 0; i < dirs.length; ++i) {
            let dir = dirs[i];
            Branch.AddFileFromLink(dir);
        }
        Branch.SaveDB();
    }
    CreateBranch(name) {
        let dirPath = _path.resolve(`${this.dir}/${name}`);
        if (!_fs.existsSync(dirPath)) {
            _fs.mkdirSync(dirPath);
            _fs.chmodSync(dirPath, '777');
        }
        let ID = util_1.createID(32), info = {
            id: ID,
            name: name,
            path: dirPath,
        }, cdb = this.branchdb.branches.find(i => i.path == dirPath);
        if (cdb == undefined) {
            this.branchdb.branches.push(info);
            this.SaveDB();
            console.log(`Novo branch foi criado: ${info.name}(${info.id})`);
        }
        else {
            info = {
                id: cdb.id,
                name: String(cdb.name),
                path: String(cdb.path),
            };
        }
        let Branch = new branch(info.name, info.path);
        Branch.info = info;
        return Branch;
    }
    getBranch(name) {
        let cdb = this.branchdb.branches.find(i => i.id == name);
        if (cdb == undefined) {
            cdb = this.branchdb.branches.find(i => i.path == _path.resolve(`${this.dir}/${name}`));
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
        let Branch = new branch(info.name, info.path);
        Branch.info = info;
        return Branch;
    }
    getFile(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isFile()) {
            console.error("'path' não representa ser um arquivo");
            return;
        }
        let cdb = this.branchdb.files.find(i => i.id == path);
        if (cdb == undefined) {
            cdb = this.branchdb.files.find(i => i.path == path);
        }
        if (cdb == undefined) {
            console.error(`'${_path.parse(path).name}' não existe.`);
            return;
        }
        return _fs.readFileSync(String(cdb.path));
    }
    getFolder(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isDirectory()) {
            console.error("'path' não representa ser uma pasta");
            return;
        }
        let cdb = this.branchdb.branches.find(i => i.id == path);
        if (cdb == undefined) {
            cdb = this.branchdb.branches.find(i => i.path == path);
        }
        if (cdb == undefined) {
            console.error(`'${_path.parse(path).name}' não existe.`);
            return;
        }
        return this.getBranch(String(cdb.name));
    }
    SaveDB() {
        _fs.writeFileSync(_path.resolve(`${this.dir}/.index.json`), JSON.stringify(this.branchdb));
    }
}
exports.default = branch;
