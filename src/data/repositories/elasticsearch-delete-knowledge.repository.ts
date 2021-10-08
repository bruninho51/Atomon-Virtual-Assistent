import { DeleteKnowledgeRepository } from "@/domain/contracts/delete-knowledge-repository.interface";
import * as elasticsearch from 'elasticsearch'
import { Elasticsearch } from "@/config/config";
import { EmployeeRepository } from "@/domain/contracts/employee-repository.interface";
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
 
export class ElasticsearchDeleteKnowledgeRepository implements DeleteKnowledgeRepository {
  constructor (private readonly employeeRepository: EmployeeRepository) {}
    
  async delete (knowledgeId: string): Promise<void> {
    const client = new elasticsearch.Client({
      hosts: [Elasticsearch.url]
    });

    const get = promisify(client.get).bind(client)

    const response = await get({
      index: 'atomon',
      type: 'knowledge',
      id: knowledgeId
    })
    
    const knowledge = response._source;

    if (knowledge.attachments) {
      for (const filename of knowledge.attachments) {
        await this.employeeRepository.deleteAttachmentByFilename(knowledge.employeeId, filename)
        try {
          fs.unlinkSync(path.join(process.cwd(), 'tmp', filename))
        } catch (error) {
          console.error(`${filename} of employee ${knowledge.employeeId} is not found!`)
        }
      }
    }

    await client.delete({
      index: "atomon",
      type: "knowledge",
      id: knowledgeId
    });

  }
}