import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels.
 *
 * Use document.baseURI instead of relying on the current page URL.
 * This keeps data loading working on GitHub Pages project sites such as
 * /cubeygdps-demonlist/.
 */
const dataUrl = (file) => new URL(`./data/${file}`, document.baseURI).href;

export async function fetchList() {
    try {
        const listResult = await fetch(dataUrl('_list.json'));

        if (!listResult.ok) {
            throw new Error(`HTTP ${listResult.status} while loading _list.json`);
        }

        const list = await listResult.json();

        if (!Array.isArray(list)) {
            throw new Error('_list.json does not contain an array');
        }

        return await Promise.all(
            list.map(async (path, rank) => {
                try {
                    const levelResult = await fetch(dataUrl(`${path}.json`));

                    if (!levelResult.ok) {
                        throw new Error(
                            `HTTP ${levelResult.status} while loading ${path}.json`,
                        );
                    }

                    const level = await levelResult.json();

                    if (!level || typeof level !== 'object') {
                        throw new Error('level JSON is not an object');
                    }

                    const records = Array.isArray(level.records)
                        ? [...level.records].sort(
                              (a, b) => b.percent - a.percent,
                          )
                        : [];

                    return [
                        {
                            ...level,
                            path,
                            records,
                        },
                        null,
                    ];
                } catch (error) {
                    console.error(
                        `Failed to load level #${rank + 1} ${path}.`,
                        error,
                    );
                    return [null, path];
                }
            }),
        );
    } catch (error) {
        console.error('Failed to load list.', error);
        return null;
    }
}

export async function fetchEditors() {
    try {
        const editorsResults = await fetch(dataUrl('_editors.json'));

        if (!editorsResults.ok) {
            throw new Error(
                `HTTP ${editorsResults.status} while loading _editors.json`,
            );
        }

        const editors = await editorsResults.json();
        return editors;
    } catch (error) {
        console.error('Failed to load list editors.', error);
        return null;
    }
}

export async function fetchLeaderboard() {
    const list = await fetchList();

    if (!list) {
        return [[], ['_list.json']];
    }

    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Verification
        const verifier = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.verifier.toLowerCase(),
        ) || level.verifier;
        scoreMap[verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
        };
        const { verified } = scoreMap[verifier];
        verified.push({
            rank: rank + 1,
            level: level.name,
            score: score(rank + 1, 100, level.percentToQualify),
            link: level.verification,
        });

        // Records
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };
            const { completed, progressed } = scoreMap[user];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, record.percent, level.percentToQualify),
                link: record.link,
            });
        });
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}
