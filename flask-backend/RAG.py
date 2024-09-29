def run(user_query):
    #pip install -U google-ai-generativelanguage google-auth-oauthlib google-labs-html-chunker

    service_account_file_name = 'service_account_key.json'

    from google.oauth2 import service_account

    credentials = service_account.Credentials.from_service_account_file(service_account_file_name)

    scoped_credentials = credentials.with_scopes(
        ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/generative-language.retriever'])

    import google.ai.generativelanguage as glm
    generative_service_client = glm.GenerativeServiceClient(credentials=scoped_credentials)
    retriever_service_client = glm.RetrieverServiceClient(credentials=scoped_credentials)
    permission_service_client = glm.PermissionServiceClient(credentials=scoped_credentials)

    # # Create a corpus
    # example_corpus = glm.Corpus(display_name="Pitt CS Wiki Articles")
    # create_corpus_request = glm.CreateCorpusRequest(corpus=example_corpus)
    # create_corpus_response = retriever_service_client.create_corpus(create_corpus_request)

    # # Save the corpus resource name for later use
    # corpus_resource_name = create_corpus_response.name
    # print(f"Corpus created with resource name: {corpus_resource_name}")

    corpus_resource_name = 'corpora/pitt-cs-wiki-articles-a260juv16bbp'
    get_corpus_request = glm.GetCorpusRequest(name=corpus_resource_name)

    # Make the request
    get_corpus_response = retriever_service_client.get_corpus(get_corpus_request)

    # Print the response
    print(get_corpus_response)

    import requests

    def fetch_website_content(url):
        response = requests.get(url)
        return response.text

    from google_labs_html_chunker.html_chunker import HtmlChunker

    def chunk_html_content(html_content):
        chunker = HtmlChunker(
            max_words_per_aggregate_passage=200,
            greedily_aggregate_sibling_nodes=True,
            html_tags_to_exclude={"noscript", "script", "style"}
        )
        return chunker.chunk(html_content)


    websites = [
        {
            'url': 'https://pittcs.wiki/career/resume',
            'display_name': 'Pitt CS Wiki - Resume'
        },
        # {
        #     'url': 'https://pittcs.wiki/zero-to-offer/building-your-case',
        #     'display_name': 'Pitt CS Wiki - Building Your Case'
        # },
        {
            'url': 'https://pittcs.wiki/zero-to-offer/ace-your-interview',
            'display_name': 'Pitt CS Wiki - Ace Your Interview'
        }
        # {
        #     'url': 'https://pittcs.wiki/zero-to-offer/post-interview',
        #     'display_name': 'Pitt CS Wiki - Post-Interview'
        # },
        # {
        #     'url': 'https://pittcs.wiki/zero-to-offer/potpourri',
        #     'display_name': 'Pitt CS Wiki - Potpourri'
        # },
        # {
        #     'url': 'https://pittcs.wiki/zero-to-offer/overview',
        #     'display_name': 'Pitt CS Wiki - Overview'
    ]

    for site in websites:
        # Fetch content
        html_content = fetch_website_content(site['url'])
        
        # Chunk content
        passages = chunk_html_content(html_content)
        
        # Create Document
        document = glm.Document(display_name=site['display_name'])
        document.custom_metadata.append(glm.CustomMetadata(key="url", string_value=site['url']))
        
        create_document_request = glm.CreateDocumentRequest(parent=corpus_resource_name, document=document)
        create_document_response = retriever_service_client.create_document(create_document_request)
        document_resource_name = create_document_response.name
        print(f"Document created with resource name: {document_resource_name}")
        
        # Create Chunks
        chunks = []
        for passage in passages:
            chunk = glm.Chunk(data={'string_value': passage})
            # Optionally add metadata to chunks
            chunk.custom_metadata.append(glm.CustomMetadata(key="source", string_value=site['display_name']))
            chunks.append(chunk)
        
        # Batch Create Chunks (max 100 per request)
        create_chunk_requests = []
        for chunk in chunks:
            create_chunk_requests.append(glm.CreateChunkRequest(parent=document_resource_name, chunk=chunk))
        
        # Since there's a limit of 100 chunks per batch, split if necessary
        for i in range(0, len(create_chunk_requests), 100):
            batch_requests = create_chunk_requests[i:i+100]
            request = glm.BatchCreateChunksRequest(parent=document_resource_name, requests=batch_requests)
            response = retriever_service_client.batch_create_chunks(request)
            print(f"Created {len(batch_requests)} chunks for document {document_resource_name}")


    import time

    def wait_for_chunks(document_resource_name):
        while True:
            request = glm.ListChunksRequest(parent=document_resource_name)
            list_chunks_response = retriever_service_client.list_chunks(request)
            states = [chunk.state for chunk in list_chunks_response.chunks]
            if all(state == glm.Chunk.State.STATE_ACTIVE for state in states):
                print("All chunks are ACTIVE.")
                break
            else:
                print("Waiting for chunks to become ACTIVE...")
                time.sleep(3)  # Wait before checking again

    # Call the function for each document
    for site in websites:
        # You should store document_resource_name per document
        wait_for_chunks(document_resource_name)



    #user_query = "How do I improve my resume for software engineering roles?"
    #user_query = "What is recruiting like for freshman?"
    results_count = 1

    # Create the query request
    query_request = glm.QueryCorpusRequest(
        name=corpus_resource_name,
        query=user_query,
        results_count=results_count
    )

    query_response = retriever_service_client.query_corpus(query_request)
    print(query_response)

    # Use a set to track passages and avoid duplicates
    #unique_passages = set()

    #min_relevance_threshold = 0.7  # Define a threshold to filter chunks

    for relevant_chunk in query_response.relevant_chunks:
            passage_text = relevant_chunk.chunk.data.string_value
            # Optionally extract the source as well
            source = None
            for metadata in relevant_chunk.chunk.custom_metadata:
                if metadata.key == "source":
                    source = metadata.string_value
            # Print the unique passage and source
            return passage_text

