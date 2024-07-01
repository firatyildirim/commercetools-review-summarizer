"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAllProducts = void 0;
const queryAllProducts = `
    query {
        listProducts {
        items {
            id
            name
            reviews {
            items {
                id
                rating
                content
            }
            }
        }
        }
    }
`;
exports.queryAllProducts = queryAllProducts;
