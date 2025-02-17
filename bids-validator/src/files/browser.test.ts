import { FileIgnoreRules } from './ignore.ts'
import { FileTree } from '../types/filetree.ts'
import { assertEquals } from '../deps/asserts.ts'
import { BIDSFileBrowser, fileListToTree } from './browser.ts'

class TestFile extends File {
  webkitRelativePath: string
  constructor(
    fileBits: BlobPart[],
    fileName: string,
    webkitRelativePath: string,
    options?: FilePropertyBag | undefined,
  ) {
    super(fileBits, fileName, options)
    this.webkitRelativePath = webkitRelativePath
  }
}

Deno.test('Browser implementation of FileTree', async (t) => {
  await t.step('converts a basic FileList', async () => {
    const ignore = new FileIgnoreRules([])
    const files = [
      new TestFile(
        ['{}'],
        'dataset_description.json',
        'dataset_description.json',
      ),
      new TestFile(['flat test dataset'], 'README.md', 'README.md'),
    ]
    const tree = await fileListToTree(files)
    const expectedTree = new FileTree('', '/', undefined)
    expectedTree.files = files.map((f) => new BIDSFileBrowser(f, ignore))
    assertEquals(tree, expectedTree)
  })
  await t.step('converts a simple FileList with several levels', async () => {
    const ignore = new FileIgnoreRules([])
    const files = [
      new TestFile(
        ['{}'],
        'dataset_description.json',
        'dataset_description.json',
      ),
      new TestFile(
        ['tsv headers\n', 'column\tdata'],
        'participants.tsv',
        'participants.tsv',
      ),
      new TestFile(['single subject test dataset'], 'README.md', 'README.md'),
      new TestFile(
        ['nifti file goes here'],
        'sub-01_T1w.nii.gz',
        'sub-01/anat/sub-01_T1w.nii.gz',
      ),
    ]
    const tree = await fileListToTree(files)
    const expectedTree = new FileTree('', '/', undefined)
    const sub01Tree = new FileTree('sub-01', 'sub-01', expectedTree)
    const anatTree = new FileTree('sub-01/anat', 'anat', sub01Tree)
    expectedTree.files = files
      .slice(0, 3)
      .map((f) => new BIDSFileBrowser(f, ignore))
    expectedTree.directories.push(sub01Tree)
    anatTree.files = [new BIDSFileBrowser(files[3], ignore)]
    sub01Tree.directories.push(anatTree)
    assertEquals(tree, expectedTree)
  })
})
