import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import { checkExists, createFolder, writeFile, readFile, getFilenameFromPath, remove } from "../src/utils/files";

const TEST_DIR = path.resolve(__dirname, ".test-output");

describe("File utilities", () => {
  afterEach(async () => {
    // Clean up test directory
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  it("checkExists should return false for non-existing path", async () => {
    const result = await checkExists(path.join(TEST_DIR, "non-existing"));
    assert.strictEqual(result, false);
  });

  it("createFolder should create a directory", async () => {
    const folder = path.join(TEST_DIR, "new-folder");
    await createFolder(folder);
    assert.strictEqual(fs.existsSync(folder), true);
  });

  it("writeFile and readFile should round-trip content", async () => {
    const filePath = path.join(TEST_DIR, "test.txt");
    await writeFile(filePath, "hello world");
    const content = await readFile(filePath);
    assert.strictEqual(content, "hello world");
  });

  it("writeFile should serialize objects to JSON", async () => {
    const filePath = path.join(TEST_DIR, "test.json");
    const obj = { key: "value", num: 42 };
    await writeFile(filePath, obj);
    const content = await readFile(filePath);
    assert.deepStrictEqual(JSON.parse(content), obj);
  });

  it("getFilenameFromPath should extract filename without extension", () => {
    assert.strictEqual(getFilenameFromPath("/some/path/file.geojson"), "file");
    assert.strictEqual(getFilenameFromPath("test.txt"), "test");
  });

  it("remove should delete an existing file", async () => {
    const filePath = path.join(TEST_DIR, "to-delete.txt");
    await createFolder(TEST_DIR);
    fs.writeFileSync(filePath, "temp");
    assert.strictEqual(fs.existsSync(filePath), true);
    await remove(filePath);
    assert.strictEqual(fs.existsSync(filePath), false);
  });

  it("remove should not throw for non-existing file", async () => {
    await remove(path.join(TEST_DIR, "non-existing.txt"));
    // no error = pass
  });
});
