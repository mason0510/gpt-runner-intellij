'use strict';

const server = require('../gpt-runner-web.eacbd9a0.cjs');
const combine_docs_chain = require('./combine_docs_chain.cjs');
require('node:http');
require('path');
require('tty');
require('util');
require('fs');
require('net');
require('events');
require('stream');
require('zlib');
require('buffer');
require('string_decoder');
require('querystring');
require('url');
require('http');
require('crypto');
require('os');
require('https');
require('assert');
require('tls');
require('node:child_process');
require('node:fs');
require('node:os');
require('node:path');
require('node:url');
require('child_process');
require('constants');
require('module');
require('domain');
require('stream/web');
require('worker_threads');
require('perf_hooks');
require('util/types');
require('async_hooks');
require('console');
require('diagnostics_channel');
require('vm');
require('process');
require('v8');
require('node:https');

class BasePromptSelector {
    async getPromptAsync(llm, options) {
        const prompt = this.getPrompt(llm);
        return prompt.partial(options?.partialVariables ?? {});
    }
}
class ConditionalPromptSelector extends BasePromptSelector {
    constructor(default_prompt, conditionals = []) {
        super();
        Object.defineProperty(this, "defaultPrompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "conditionals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.defaultPrompt = default_prompt;
        this.conditionals = conditionals;
    }
    getPrompt(llm) {
        for (const [condition, prompt] of this.conditionals) {
            if (condition(llm)) {
                return prompt;
            }
        }
        return this.defaultPrompt;
    }
}
function isChatModel(llm) {
    return llm._modelType() === "base_chat_model";
}

/* eslint-disable spaced-comment */
const DEFAULT_QA_PROMPT = /*#__PURE__*/ new server.PromptTemplate({
    template: "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\nQuestion: {question}\nHelpful Answer:",
    inputVariables: ["context", "question"],
});
const system_template = `Use the following pieces of context to answer the users question. 
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;
const messages = [
    /*#__PURE__*/ server.SystemMessagePromptTemplate.fromTemplate(system_template),
    /*#__PURE__*/ server.HumanMessagePromptTemplate.fromTemplate("{question}"),
];
const CHAT_PROMPT = 
/*#__PURE__*/ server.ChatPromptTemplate.fromPromptMessages(messages);
const QA_PROMPT_SELECTOR = /*#__PURE__*/ new ConditionalPromptSelector(DEFAULT_QA_PROMPT, [[isChatModel, CHAT_PROMPT]]);

function loadQAStuffChain(llm, params = {}) {
    const { prompt = QA_PROMPT_SELECTOR.getPrompt(llm), verbose } = params;
    const llmChain = new server.LLMChain({ prompt, llm, verbose });
    const chain = new combine_docs_chain.StuffDocumentsChain({ llmChain, verbose });
    return chain;
}

class VectorDBQAChain extends server.BaseChain {
    get inputKeys() {
        return [this.inputKey];
    }
    get outputKeys() {
        return this.combineDocumentsChain.outputKeys.concat(this.returnSourceDocuments ? ["sourceDocuments"] : []);
    }
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "k", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "query"
        });
        Object.defineProperty(this, "vectorstore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "combineDocumentsChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnSourceDocuments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.vectorstore = fields.vectorstore;
        this.combineDocumentsChain = fields.combineDocumentsChain;
        this.inputKey = fields.inputKey ?? this.inputKey;
        this.k = fields.k ?? this.k;
        this.returnSourceDocuments =
            fields.returnSourceDocuments ?? this.returnSourceDocuments;
    }
    /** @ignore */
    async _call(values, runManager) {
        if (!(this.inputKey in values)) {
            throw new Error(`Question key ${this.inputKey} not found.`);
        }
        const question = values[this.inputKey];
        const docs = await this.vectorstore.similaritySearch(question, this.k, values.filter);
        const inputs = { question, input_documents: docs };
        const result = await this.combineDocumentsChain.call(inputs, runManager?.getChild("combine_documents"));
        if (this.returnSourceDocuments) {
            return {
                ...result,
                sourceDocuments: docs,
            };
        }
        return result;
    }
    _chainType() {
        return "vector_db_qa";
    }
    static async deserialize(data, values) {
        if (!("vectorstore" in values)) {
            throw new Error(`Need to pass in a vectorstore to deserialize VectorDBQAChain`);
        }
        const { vectorstore } = values;
        if (!data.combine_documents_chain) {
            throw new Error(`VectorDBQAChain must have combine_documents_chain in serialized data`);
        }
        return new VectorDBQAChain({
            combineDocumentsChain: await server.BaseChain.deserialize(data.combine_documents_chain),
            k: data.k,
            vectorstore,
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            combine_documents_chain: this.combineDocumentsChain.serialize(),
            k: this.k,
        };
    }
    static fromLLM(llm, vectorstore, options) {
        const qaChain = loadQAStuffChain(llm);
        return new this({
            vectorstore,
            combineDocumentsChain: qaChain,
            ...options,
        });
    }
}

exports.VectorDBQAChain = VectorDBQAChain;
