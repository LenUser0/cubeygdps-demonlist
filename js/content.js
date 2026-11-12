import { round, score } from './score.js';

/**
 * Each list has its own level index and level JSON files, while the page
 * components and the shared editor information remain the same.
 */
const listSources = {
    demon: { directory: '../data/', listFile: '_list.json' },
    challenge: { directory: '../data/challenge/', listFile: '_list.json' },
    impossible: { directory: '../data/impossible/', listFile: '_list.json' },
    platformer: { directory: '../data/platformer/', listFile: '_list.json' },
    nondemon: { directory: '../data/non-demon/', listFile: '_list.json' },
};

const getListSource = (listId = 'demon') =>
    listSources[listId] ?? listSources.demon;

const dataUrl = (directory, file) =>
    new URL(`${directory}${file}`, import.meta.url).href;

export async function fetchList(listId = 'demon', { includeRecords = true } = {}) {
    const source = getListSource(listId);

    try {
        const listResult = await fetch(dataUrl(source.directory, source.listFile));

        if (!listResult.ok) {
            throw new Error(`HTTP ${listResult.status} while loading _list.json`);
        }

        const list = await listResult.json();

        if (!Array.isArray(list)) {
            throw new Error('_list.json does not contain an array');
        }

        // Limit concurrent downloads/parsing to reduce peak memory usage.
        const results = [];
        const batchSize = 8;

        for (let start = 0; start < list.length; start += batchSize) {
            const batch = await Promise.all(
                list.slice(start, start + batchSize).map(async (path, index) => {
                    const rank = start + index;

                    try {
                        const levelResult = await fetch(
                            dataUrl(source.directory, path + '.json'),
                        );

                        if (!levelResult.ok) {
                            throw new Error(
                                'HTTP ' + levelResult.status + ' while loading ' + path + '.json',
                            );
                        }

                        const level = await levelResult.json();

                        if (!level || typeof level !== 'object') {
                            throw new Error('level JSON is not an object');
                        }

                        const records = includeRecords && Array.isArray(level.records)
                            ? level.records.sort(
                                  // Put verified completions (100%) first, then sort by highest progress.
                                  (a, b) => (b.percent ?? 0) - (a.percent ?? 0),
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
                            'Failed to load level #' + (rank + 1) + ' ' + path + '.',
                            error,
                        );
                        return [null, path];
                    }
                }),
            );

            results.push(...batch);
        }

        return results;
    } catch (error) {
        console.error('Failed to load list.', error);
        return null;
    }
}


export async function fetchLevelRecords(path, listId = 'demon') {
    const source = getListSource(listId);
    const result = await fetch(dataUrl(source.directory, path + '.json'));

    if (!result.ok) {
        throw new Error('HTTP ' + result.status + ' while loading ' + path + '.json');
    }

    const level = await result.json();

    return Array.isArray(level?.records)
        ? level.records.sort(
              (a, b) => (b.percent ?? 0) - (a.percent ?? 0),
          )
        : [];
}

export async function fetchEditors() {
    try {
        const editorsResults = await fetch(dataUrl('../data/', '_editors.json'));

        if (!editorsResults.ok) {
            throw new Error(
                `HTTP ${editorsResults.status} while loading _editors.json`,
            );
        }

        const editors = await editorsResults.json();
        // Keep List Helper in _editors.json for possible future use, but hide it from the page.
        return editors.filter((editor) => editor.role !== 'helper');
    } catch (error) {
        console.error('Failed to load list editors.', error);
        return null;
    }
}

export async function fetchLeaderboard(listId = 'demon') {
    const source = getListSource(listId);
    const errs = [];
    let paths;

    try {
        const listResult = await fetch(dataUrl(source.directory, source.listFile));

        if (!listResult.ok) {
            throw new Error(`HTTP ${listResult.status} while loading ${source.listFile}`);
        }

        paths = await listResult.json();

        if (!Array.isArray(paths)) {
            throw new Error('_list.json does not contain an array');
        }
    } catch (error) {
        console.error('Failed to load leaderboard list.', error);
        return [[], [source.listFile]];
    }

    const isImpossible = listId === "impossible";
    const scoreMap = {};
    const userNames = new Map();
    const getUserKey = (name) => {
        const normalized = name.toLowerCase();
        if (!userNames.has(normalized)) {
            userNames.set(normalized, name);
        }
        return userNames.get(normalized);
    };

    // Load, process, and release each level JSON before moving to the next one.
    for (let index = 0; index < paths.length; index++) {
        const path = paths[index];
        const rank = index + 1;

        try {
            const result = await fetch(dataUrl(source.directory, path + '.json'));

            if (!result.ok) {
                throw new Error('HTTP ' + result.status + ' while loading ' + path + '.json');
            }

            const level = await result.json();

            if (!level || typeof level !== 'object') {
                throw new Error('level JSON is not an object');
            }

            if (!isImpossible && level.verifier) {
                const verifier = getUserKey(level.verifier);
                scoreMap[verifier] ??= {
                    verified: [],
                    completed: [],
                    progressed: [],
                };
                scoreMap[verifier].verified.push({
                    rank,
                    level: level.name,
                    score: score(rank, 100, level.percentToQualify),
                    link: level.verification,
                });
            }

            const records = Array.isArray(level.records) ? level.records : [];
            records.sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0));

            for (const record of records) {
                const user = getUserKey(record.user);
                scoreMap[user] ??= {
                    verified: [],
                    completed: [],
                    progressed: [],
                };
                const { completed, progressed } = scoreMap[user];

                if (record.percent === 100) {
                    completed.push({
                        rank,
                        level: level.name,
                        score: score(rank, 100, level.percentToQualify),
                        link: record.link,
                    });
                    continue;
                }

                progressed.push({
                    rank,
                    level: level.name,
                    percent: record.percent,
                    score: score(rank, record.percent, level.percentToQualify),
                    link: record.link,
                });
            }
        } catch (error) {
            console.error('Failed to load leaderboard level ' + path + '.', error);
            errs.push(path);
        }
    }

    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        let total = 0;
        for (const item of verified) total += item.score;
        for (const item of completed) total += item.score;
        for (const item of progressed) total += item.score;

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    return [res.sort((a, b) => b.total - a.total), errs];
}
