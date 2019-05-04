"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./src");
const ray = new src_1.default('./data');
ray.CreateCollection('Mangá').then(async (Collection) => {
    await Collection.AddFolderFromLink('D:\\Users\\Usuario\\Pictures\\Mangá\\Abarenbo Honey');
    console.log(Collection);
});
// fs.readdir(path.resolve('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto'), (err, files) => {
//
//         if (
//             v.startsWith('nP') &&
//             fs.existsSync('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto\\' + v) &&
//             fs.lstatSync('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto\\' + v).isDirectory()
//         ) {
//             let g = v.split('_');
//             console.log(`Capítulo ${g[1]}`);
//             fs.renameSync(
//                 'D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto\\' + v,
//                 'D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto\\Capítulo ' + g[1],
//             );
//         }
//     });
// });
// console.log(_path.basename('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto')); // Naruto
// console.log(_path.dirname('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto')); // D:\Users\Usuario\Pictures\Mangá
// console.log(_path.extname('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto')); //
// console.log(_path.isAbsolute('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto')); // true
// console.log(_path.join('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto')); // D:\Users\Usuario\Pictures\Mangá\Naruto
// console.log(_path.normalize('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto')); // D:\Users\Usuario\Pictures\Mangá\Naruto
// console.log(_path.parse('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto')); // { root: 'D:\\', dir: 'D:\\Users\\Usuario\\Pictures\\Mangá', base: 'Naruto', ext: '', name: 'Naruto' }
// console.log(_path.resolve('D:\\Users\\Usuario\\Pictures\\Mangá\\Naruto')); // D:\Users\Usuario\Pictures\Mangá\Naruto
// console.log('\n--------------------------------------------------------------------------------\n');
// console.log(_path.basename('./dist/src/')); // src
// console.log(_path.dirname('./dist/src/')); // ./dist
// console.log(_path.extname('./dist/src/')); //
// console.log(_path.isAbsolute('./dist/src/')); // false
// console.log(_path.join('./dist/src/')); // dist\src\
// console.log(_path.normalize('./dist/src/')); // dist\src\
// console.log(_path.parse('./dist/src/')); // { root: '', dir: './dist', base: 'src', ext: '', name: 'src' }
// console.log(_path.resolve('./dist/src/')); // h:\Programing\JavaScript\RayDB\dist\src
