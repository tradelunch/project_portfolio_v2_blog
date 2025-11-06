import TerminalProfile from '@/app/MainPage';

export default function Page() {
    // This is a Server Component, so you can read files directly from the filesystem.
    // Note: This path is relative to the root of the monorepo.
    // We use `process.cwd()` which points to the root in a Turborepo setup.

    // const fileContent = await fs.readFile(testFilePath, "utf8");
    return (
        <section className="p-4">
            <TerminalProfile />
        </section>
    );
}
