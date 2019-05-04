export type collectionType = {
    id: string | undefined;
    path: string | undefined;
    name: string | undefined;
};

export type branchType = {
    id: string | undefined;
    path: string | undefined;
    name: string | undefined;
};

export type fileType = {
    id: string | undefined;
    path: string | undefined;
    name: string | undefined;
};

export type indexdbType = {
    collections: Array<collectionType>;
};

export type collectiondbType = {
    branches: Array<branchType>;
};

export type branchdbType = {
    branches: Array<branchType>;
    files: Array<fileType>;
};
