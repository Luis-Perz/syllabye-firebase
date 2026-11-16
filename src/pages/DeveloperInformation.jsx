import "../css/DeveloperInformation.css";

const developers = [
    { name: "Molly P.", email: "mollyepaez@lewisu.edu" },
    { name: "Luis P.", email: "luisaperez1@lewisu.edu" },
    { name: "Bobby D.", email: "robertmdidomenico@lewisu.edu" },
    { name: "Troy N.", email: "troyanaill@lewisu.edu" },
    { name: "Beth F.", email: "bethanygfeddes@lewisu.edu" },
    { name: "Michael M.", email: "michaelkmihailov@lewisu.edu" },
    { name: "Jacob P.", email: "jacobwpetrosky@lewisu.edu" },
];

export default function DeveloperInformation() {
    return (
        <main className="developer-information">
            <header className="developer-information__header">
                <h1>Developer Information</h1>
                <p>Contact a member of the Syllabye development team if you have questions or need help.</p>
            </header>

            <section className="developer-information__list" aria-label="Development team contacts">
                {developers.map((developer) => (
                    <article className="developer-information__card" key={developer.email}>
                        <h2>{developer.name}</h2>
                        <a href={`mailto:${developer.email}`}>{developer.email}</a>
                    </article>
                ))}
            </section>
        </main>
    );
}
