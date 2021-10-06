import { GetKnowledgeRepository } from "@/domain/contracts/get-knowledge-repository.interface";
import { Knowledge } from "@/domain/models/knowledge";
import * as elasticsearch from 'elasticsearch'
import { Elasticsearch } from "@/config/config";
import { EmployeeRepository } from "@/domain/contracts/employee-repository.interface";
import { Employee } from "@/domain/models/employee";
import { Level } from "@/domain/models/level";

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
        const data = hit._source
        const employee = await this.employeeRepository.findById(data.employeeId) as Employee & { level: Level }
        knowledges.push({
          title: data.title,
          body: data.knowledge,
          employeeId: data.employeeId,
          employeeName: employee.name,
          levelName: employee.level.name,
          createdAt: data.createdAt ? new Date(data.createdAt * 1000) : null,
          attachments: await Promise.all(data.attachments?.map((filename: string) => {
            // obter attachment via repositório
            return this.employeeRepository.getAttachmentByFilename(data.employeeId, filename)
          }) ?? [])
        })
      }
    }

    return knowledges.length ? knowledges : null
  }
}