import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplyForJobDto, ErpJobDto, JobApplicationResultDto } from './dto';

type ErpMessage<T> = { message?: T };
type ErpJobsMessage = { jobs?: ErpJobDto[]; count?: number };
type ErpJobMessage = { job?: ErpJobDto } | ErpJobDto;

@Injectable()
export class CareersService {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = (config.get<string>('ERP_BASE_URL') || '').replace(
      /\/$/,
      '',
    );
  }

  async getJobs(): Promise<{ jobs: ErpJobDto[]; count: number }> {
    const payload = await this.request<ErpJobsMessage>('get_jobs');
    const jobs = Array.isArray(payload.jobs) ? payload.jobs : [];
    return { jobs, count: jobs.length };
  }

  async getJob(id: string): Promise<{ job: ErpJobDto }> {
    const payload = await this.request<ErpJobMessage>(
      `get_job?job=${encodeURIComponent(id)}`,
      undefined,
      true,
    );
    const wrapped = payload as { job?: ErpJobDto };
    const job = wrapped.job ?? (payload as ErpJobDto);

    if (!job?.id) {
      throw new NotFoundException('Job not found or no longer published.');
    }

    return { job };
  }

  async apply(
    id: string,
    application: ApplyForJobDto,
  ): Promise<JobApplicationResultDto> {
    const payload = await this.request<JobApplicationResultDto>(
      'apply_for_job',
      {
        ...application,
        cover_letter: application.cover_letter || '',
        job: id,
      },
      true,
    );

    if (!payload.success) {
      throw new BadGatewayException('ERPNext did not accept the application.');
    }

    return payload;
  }

  private async request<T>(
    method: string,
    body?: Record<string, string>,
    notFoundAware = false,
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new ServiceUnavailableException('ERPNext is not configured.');
    }

    let response: Response;
    try {
      response = await fetch(
        `${this.baseUrl}/api/method/takeweb_suite.api.website.${method}`,
        {
          method: body ? 'POST' : 'GET',
          headers: body ? { 'Content-Type': 'application/json' } : undefined,
          body: body ? JSON.stringify(body) : undefined,
          signal: AbortSignal.timeout(10000),
        },
      );
    } catch {
      throw new ServiceUnavailableException(
        'ERPNext is currently unavailable.',
      );
    }

    const raw = await response.text();
    let data: ErpMessage<T> = {};
    try {
      data = JSON.parse(raw) as ErpMessage<T>;
    } catch {
      throw new BadGatewayException('ERPNext returned an invalid response.');
    }

    if (!response.ok || data.message === undefined) {
      this.throwErpError(response.status, raw, notFoundAware);
    }

    return data.message as T;
  }

  private throwErpError(
    status: number,
    rawMessage: string,
    notFoundAware: boolean,
  ): never {
    const message = rawMessage.toLowerCase();

    if (notFoundAware && (status === 404 || message.includes('not found'))) {
      throw new NotFoundException('Job not found or no longer published.');
    }
    if (
      message.includes('closed') ||
      message.includes('unpublished') ||
      message.includes('not accepting')
    ) {
      throw new BadRequestException(
        'This job is no longer accepting applications.',
      );
    }
    if (message.includes('duplicate') || message.includes('already applied')) {
      throw new ConflictException(
        'An application already exists for this email.',
      );
    }
    if (message.includes('email')) {
      throw new BadRequestException('Please provide a valid email address.');
    }
    if (status >= 500) {
      throw new ServiceUnavailableException(
        'ERPNext is currently unavailable.',
      );
    }
    throw new BadGatewayException('ERPNext could not process the request.');
  }
}
