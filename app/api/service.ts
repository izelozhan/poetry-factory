import * as fs from "fs";
import weaviate, {
  WeaviateClient,
  ObjectsBatcher,
  ApiKey,
}
//@ts-ignore
from "weaviate-ts-client";



let client: WeaviateClient | null;
const collectionName = "Poem_dataset";

type DatasetPoemType = {
  Poet: string;
  Poem: string;
  Genre: string;
  Title: string;
};


type CollectionType = {
    class: string;
    vectorizer: string;
    moduleConfig: {
      "text2vec-openai": {};
      "generative-openai": {};
    };
  };
  
// This variable will be used to store if collection data has been loaded, or needs to be loaded
let collectionDataVerified = false;

const retreiveCollectionData = async () => {
  const fileString = fs.readFileSync("dataset.json");
  return JSON.parse(fileString.toString()) as DatasetPoemType[];
};

const collectionClass: CollectionType = {
  class: collectionName,
  vectorizer: "text2vec-openai",
  moduleConfig: {
    "text2vec-openai": {},
    "generative-openai": {},
  },
};

// Create a collection with the given name and insert data into it
// If the collection already exists, return the existing collection
const createCollection = async (name: string, client: WeaviateClient) => {
  try {
    const result = await client.schema
      .classCreator()
      .withClass(collectionClass)
      .do();
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create collection ${name}`);
  }

  await insertToCollection(client);
};

const insertToCollection = async (client: WeaviateClient) => {
  const data = await retreiveCollectionData();
  try {
    let batcher: ObjectsBatcher = client.batch.objectsBatcher();
    let counter = 0;
    const batchSize = 1000;

    for (const record of data) {
      const obj = {
        class: collectionName,
        properties: {
          title: record.Title,
          poem: record.Poem,
          poet: record.Poet,
          genre: record.Genre,
        },
      };
      batcher = batcher.withObject(obj);
      if (counter++ == batchSize) {
        const res = await batcher.do();
        console.log('batch_inserted');
        counter = 0;
        batcher = client.batch.objectsBatcher();
      }
    }

    // Flush the remaining objects
    const res = await batcher.do();
    console.log(res);
  } catch (error) {
    throw Error(`Failed to insert data into collection ${name}`);
  }
};

const ensureCollectionExists = async (name: string, client: WeaviateClient) => {
  const collections = await client.schema.getter().do();
  const collectionExists = collections.classes?.some(
    (i:any) => i.class?.toLowerCase() === name?.toLowerCase()
  );
  if (!collectionExists) {
    await createCollection(name, client);
  } else {
    if (collectionDataVerified == false) {
      //check if collection is empty or not
      const filter = await client.graphql
        .get()
        .withClassName(name)
        .withFields("title")
        .withLimit(1)
        .do();
      const isEmpty = filter.data.length === 0;
      if (isEmpty) {
        //maybe failed to insert data, try again
        insertToCollection(client);
      }
      collectionDataVerified = true;
    }
  }
};

const getClient = async () => {
  const serviceURL = process.env?.WCD_URL;
  const serviceApiKey = process.env?.WCD_API_KEY;
  const openAIKey = process.env?.OPENAI_APIKEY;
  if (!serviceURL || !serviceApiKey) {
    throw Error(`Can't generate client without service URL and API key.`);
  } else if (!openAIKey) {
    throw Error(`Can't generate client without OpenAI API key.`);
  } else {
    const client: WeaviateClient = weaviate.client({
      scheme: "https",
      host: serviceURL,
      apiKey: new ApiKey(serviceApiKey),
      headers: { "X-OpenAI-Api-Key": openAIKey },
    });

    await ensureCollectionExists(collectionName, client);
    return client;
  }
};

const getWritersBasedOnFeeling = async (
  client: WeaviateClient,
  feeling: string
) => {
  const response = await client.graphql
    .aggregate()
    .withClassName(collectionName)
    .withWhere({
      path: ["genre"],
      operator: "Equal",
      valueText: feeling,
    })
    .withGroupBy(["poet"])
    .withFields("groupedBy { value } meta { count }")
    .do();

  const result = response.data.Aggregate[collectionName]
    .map((i: any) => i.groupedBy.value)
    .sort();
  return result;
};

const getGenres = async (client: WeaviateClient) => {
  const response = await client.graphql
    .aggregate()
    .withClassName(collectionName)
    .withGroupBy(["genre"])
    .withFields("groupedBy { value } meta { count }")
    .do();

  const result = response.data.Aggregate[collectionName]
    .map((i: any) => i.groupedBy.value)
    .sort();
  return result;
};

const generate = async (
  client: WeaviateClient,
  feeling: string,
  writers: string[],
  concept: string
) => {
  const response = await client.graphql
    .get()
    .withClassName(collectionName)
    .withWhere({
      operator: "And",
      operands: [
        {
          path: ["genre"],
          operator: "Equal",
          valueText: feeling,
        },
        {
          path: ["poet"],
          operator: "ContainsAny",
          valueStringArray: writers,
        },
      ],
    })
    .withGenerate({
      singlePrompt: `
                You are provided with poems {poem} reflecting ${feeling} feeling from writers ${writers.join(
        ", "
      )}.
                You should write a poem about ${feeling}. 
                ${
                  concept
                    ? `Poem needs to involve following thought / concept: ${concept}`
                    : ""
                }
                `,
    })
    .withFields("poem")
    .withLimit(1)
    .do();

  let poem = (response.data.Get[collectionName] || []).at(0)?.["_additional"]?.[
    "generate"
  ]?.["singleResult"];
  if (!poem) {
    return "I am sorry, I could not generate a poem for you. Trying to find muse. Please try again later.";
  } else {
    return poem;
  }
};

const startup = async () => {
    await getClient();
    console.log('collection exists');
}


const service = {
  getPoets: async (feeling: string) => {
    const client = await getClient();
    return await getWritersBasedOnFeeling(client, feeling);
  },
  getFeelings: async () => {
    const client = await getClient();
    return await getGenres(client);
  },
  generate: async (feeling: string, poets: string[], concept: string) => {
    const client = await getClient();
    return generate(client, feeling, poets, concept);
  },
  startup
};
export default service;
