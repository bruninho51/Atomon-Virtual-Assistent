import { GetKnowledgeRepository } from "../../domain/contracts/get-knowledge-repository.interface";
import { Knowledge } from "../../domain/models/knowledge";
import * as elasticsearch from 'elasticsearch'
import { Elasticsearch } from "../../config/config";
import { EmployeeRepository } from "../../domain/contracts/employee-repository.interface";

export class ElasticsearchGetKnowledgeRepository implements GetKnowledgeRepository {
  constructor (private readonly employeeRepository: EmployeeRepository) {}
    
  async get (keywords: string[], employeeId?: number): Promise<Knowledge[]> {
    const client = new elasticsearch.Client({
      hosts: [Elasticsearch.url]
    });

    const query = {
      bool: {
        must: {
          multi_match: {
            query: keywords.join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            operator: 'and',
            fuzziness: "AUTO",
            analyzer: "atomon_analyzer",
            fields: ["knowledge", "title"]
          },
        },
      }
    }

    if (employeeId) {
      query.bool['filter'] = {
        term: { employeeId }
      }
    }

    const { hits }: any = await client.search({
      index: 'atomon',
      type: 'knowledge',
      body: {
        query
      }
    })

    const knowledges: Knowledge[] = []

    if (hits.total.value !== 0) {
      for (const hit of hits.hits) {
        knowledges.push({
          title: hit._source.title,
          body: hit._source.knowledge,
          employeeId: hit._source.employeeId,
          attachments: await Promise.all(hit._source.attachments?.map((filename: string) => {
            // obter attachment via repositório
            return this.employeeRepository.getAttachmentByFilename(hit._source.employeeId, filename)
          }) ?? [])
        })
      }
    }

    return knowledges.length ? knowledges : null
  }
}