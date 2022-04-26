import neo4j from "neo4j-driver";

const uri = 'neo4j+s://06f06c4a.databases.neo4j.io';
const user = 'neo4j';
const password = process.env.NEO4J;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export default async function handler(req, res) {
    const session = driver.session();
    const response = await session.run('MATCH (w) RETURN LABELS(w), COUNT(w) AS count, w');

    const records = response.records.map((record) => {
        return record.toObject();
    })
    res.status(200).json({body: records});

    return { props: records};
}

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}

module.exports = allowCors(handler)

