import Module from 'module';
import path from 'path';

// Override Node's module resolution to handle the '@/' alias
const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (
  request: string,
  parent: any,
  isMain: boolean,
  options: any
) {
  if (request.startsWith('@/')) {
    const relativePath = request.slice(2);
    request = path.resolve(__dirname, relativePath);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// Register require extensions to mock static assets
const mockAsset = (module: any) => {
  module.exports = 1;
};

require.extensions['.png'] = mockAsset;
require.extensions['.jpg'] = mockAsset;
require.extensions['.jpeg'] = mockAsset;
require.extensions['.gif'] = mockAsset;
require.extensions['.webp'] = mockAsset;
require.extensions['.svg'] = mockAsset;
