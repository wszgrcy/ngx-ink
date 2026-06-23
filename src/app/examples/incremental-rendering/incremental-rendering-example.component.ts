import { Component, signal, computed, OnDestroy } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput, useApp, useWindowSize } from '@cyia/ngx-lib';

const rows = [
    'Server Authentication Module - Handles JWT token validation, OAuth2 flows, and session management across distributed systems',
    'Database Connection Pool - Maintains persistent connections to PostgreSQL cluster with automatic failover and load balancing',
    'API Gateway Service - Routes incoming HTTP requests to microservices with rate limiting and request transformation',
    'User Profile Manager - Caches user data in Redis with write-through policy and invalidation strategies',
    'Payment Processing Engine - Integrates with Stripe, PayPal, and Square APIs for transaction processing',
    'Email Notification Queue - Processes outbound emails through SendGrid with retry logic and delivery tracking',
    'File Storage Handler - Manages S3 bucket operations with multipart uploads and CDN integration',
    'Search Indexer Service - Maintains Elasticsearch indices with real-time document updates and reindexing',
    'Metrics Aggregation Pipeline - Collects and processes telemetry data for Prometheus and Grafana dashboards',
    'WebSocket Connection Manager - Handles real-time bidirectional communication for chat and notifications',
    'Cache Invalidation Service - Coordinates distributed cache updates across Redis cluster nodes',
    'Background Job Processor - Executes async tasks via RabbitMQ with dead letter queue handling',
    'Session Store Manager - Persists user sessions in DynamoDB with TTL and cross-region replication',
    'Rate Limiter Module - Enforces API quotas using token bucket algorithm with Redis backend',
    'Content Delivery Network - Serves static assets through Cloudflare with edge caching and GZIP compression',
    'Logging Aggregator - Streams application logs to ELK stack with structured JSON formatting',
    'Health Check Monitor - Performs periodic service health checks with circuit breaker pattern implementation',
    'Configuration Manager - Loads environment-specific settings from Consul with hot reload capability',
    'Security Scanner Service - Runs automated vulnerability scans and dependency checks on deployed applications',
    'Backup Orchestrator - Schedules and executes automated database backups with encryption and versioning',
    'Load Balancer Controller - Manages NGINX upstream servers with health-based traffic distribution',
    'Container Orchestration - Coordinates Docker container lifecycle via Kubernetes with auto-scaling policies',
    'Message Bus Coordinator - Routes events through Apache Kafka topics with guaranteed delivery semantics',
    'Analytics Data Warehouse - Aggregates business metrics in Snowflake with incremental ETL processes',
    'API Documentation Service - Generates and serves OpenAPI specs with interactive Swagger UI',
    'Feature Flag Manager - Controls feature rollouts using LaunchDarkly with user targeting and percentage rollouts',
    'Audit Trail Logger - Records all user actions and system events for compliance and security analysis',
    'Image Processing Pipeline - Resizes and optimizes uploaded images using Sharp with multiple format outputs',
    'Geolocation Service - Resolves IP addresses to geographic coordinates using MaxMind GeoIP2 database',
    'Recommendation Engine - Generates personalized content suggestions using collaborative filtering algorithms',
];

const generateLogLine = (index: number, value: number) => {
    const timestamp = new Date().toLocaleTimeString();
    const actions = ['PROCESSING', 'COMPLETED', 'UPDATING', 'SYNCING', 'VALIDATING', 'EXECUTING'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return `[${timestamp}] Worker-${index} ${action}: Batch=${value} Throughput=${(Math.random() * 1000).toFixed(0)}req/s Memory=${(Math.random() * 512).toFixed(1)}MB CPU=${(Math.random() * 100).toFixed(1)}%`;
};

@Component({
    selector: 'ink-incremental-rendering-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './incremental-rendering-example.component.html',
})
export class IncrementalRenderingExampleComponent implements OnDestroy {
    private readonly app = useApp();
    private readonly windowSize = useWindowSize();

    selectedIndex = signal(0);
    timestamp = signal(new Date().toLocaleTimeString());
    counter = signal(0);
    fps = signal(0);
    progress1 = signal(0);
    progress2 = signal(0);
    progress3 = signal(0);
    randomValue = signal(0);
    logLines = signal<string[]>([]);

    // Derived signals (equivalent to React's computed values on each render)
    readonly availableLines = computed(() => {
        const terminalHeight = this.windowSize().rows;
        return Math.max(terminalHeight - 15, 10);
    });

    readonly logLineCount = computed(() => Math.max(Math.floor(this.availableLines() * 0.3), 3));
    readonly serviceCount = computed(() => {
        const count = Math.min(Math.max(Math.floor(this.availableLines() * 0.7), 5), rows.length);
        return count;
    });

    readonly rows = rows;

    private timers: ReturnType<typeof setTimeout>[] = [];
    private frameCount = 0;
    private lastTime = Date.now();

    constructor() {
        // Initialize logLines with initial count (equivalent to React's useState initialization)
        this.logLines.set(
            Array.from({ length: this.logLineCount() }, (_, i) => generateLogLine(i, 0)),
        );

        // Update timestamp and counter every second
        this.timers.push(
            setInterval(() => {
                this.timestamp.set(new Date().toLocaleTimeString());
                this.counter.update((v) => v + 1);
            }, 1000),
        );

        // Rapid updates to degrade performance - updates every 16ms (~60fps)
        const rapidTimer = setInterval(() => {
            this.progress1.update((v) => (v + 1) % 101);
            this.progress2.update((v) => (v + 2) % 101);
            this.progress3.update((v) => (v + 3) % 101);
            this.randomValue.set(Math.floor(Math.random() * 1000));

            // Update only 1-2 log lines each frame
            this.logLines.update((previous) => {
                const newLines = [...previous];
                const updateIndex = Math.floor(Math.random() * newLines.length);
                newLines[updateIndex] = generateLogLine(
                    updateIndex,
                    Math.floor(Math.random() * 1000),
                );
                return newLines;
            });

            // Calculate FPS (equivalent to React's frameCount/lastTime logic)
            this.frameCount++;
            const now = Date.now();
            if (now - this.lastTime >= 1000) {
                this.fps.set(this.frameCount);
                this.frameCount = 0;
                this.lastTime = now;
            }
        }, 16);
        this.timers.push(rapidTimer);

        useInput((input, key) => {
            const serviceCount = this.serviceCount();
            if (key.upArrow) {
                this.selectedIndex.update((previousIndex) =>
                    previousIndex === 0 ? serviceCount - 1 : previousIndex - 1,
                );
            }

            if (key.downArrow) {
                this.selectedIndex.update((previousIndex) =>
                    previousIndex === serviceCount - 1 ? 0 : previousIndex + 1,
                );
            }

            if (input === 'q') {
                this.app().exit();
            }
        });
    }

    progressBar(value: number): string {
        const filled = Math.floor(value / 5);
        const empty = 20 - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    }

    readonly selectedService = computed(
        () => rows.slice(0, this.serviceCount())[this.selectedIndex()] || '',
    );

    ngOnDestroy() {
        this.timers.forEach((t) => clearTimeout(t));
    }
}
