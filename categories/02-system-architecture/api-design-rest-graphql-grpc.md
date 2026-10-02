# Skill: API Design (REST, GraphQL, gRPC)
`id`: `kbcodedev/api-design-rest-graphql-grpc`  
`category`: `02-system-architecture`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring public or internal APIs, defining communication schemas, standardizing pagination/error shapes, and choosing between REST, GraphQL, and gRPC.
- **Triggers**: New API endpoint development, OpenAPI/Swagger authoring, Protobuf definition, GraphQL schema design.
- **Prerequisites**: Consumer access patterns (Mobile vs Web vs Service-to-Service), latency constraints, bandwidth requirements.

---

## 2. Core Mental Model & Invariant Principles
1. **Protocol-Pattern Fit**:
   - **REST (OpenAPI 3.1)**: Best for public web APIs, standard CRUD, caching at CDN edge.
   - **GraphQL**: Best for complex client-driven UI views, aggregated data from multiple backends, preventing over/under-fetching.
   - **gRPC (Protobuf)**: Best for low-latency internal microservice communication, bidirectional streaming, strongly typed binary contracts.
2. **Consistent Error Envelope**: Always return RFC 7807 (`application/problem+json`) compliant structured error objects.
3. **Deterministic Pagination**: Use cursor-based pagination (`cursor=base64(created_at,id)`) for all high-volume collections instead of offset/limit.

---

## 3. High-Signal Execution Workflow

```
       [Client / Architecture Requirement]
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
   [Public Web]    [Mobile / SPA]  [Inter-Service]
         │              │              │
         ▼              ▼              ▼
     ┌───────┐     ┌─────────┐    ┌────────┐
     │ REST  │     │ GraphQL │    │  gRPC  │
     └───────┘     └─────────┘    └────────┘
```

### 1. REST API Standard (OpenAPI 3.1)
- Plural nouns for resource collections: `/v1/organizations/{orgId}/projects`
- Correct HTTP verbs: `GET` (Safe/Idempotent), `POST` (Create), `PUT` (Replace), `PATCH` (Partial), `DELETE` (Remove).
- Standardized Error Envelope:
```json
{
  "type": "https://api.example.com/errors/resource-not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Project with ID 'proj_123' does not exist in organization 'org_456'",
  "instance": "/v1/organizations/org_456/projects/proj_123",
  "code": "PROJECT_NOT_FOUND"
}
```

### 2. gRPC Protocol Buffers Contract
```protobuf
syntax = "proto3";
package order.v1;

service OrderService {
  rpc GetOrder (GetOrderRequest) returns (OrderResponse);
  rpc StreamOrderUpdates (StreamOrderRequest) returns (stream OrderStatusUpdate);
}

message GetOrderRequest {
  string order_id = 1;
}

message OrderResponse {
  string order_id = 1;
  string user_id = 2;
  int64 total_cents = 3;
  enum Status { UNKNOWN = 0; PENDING = 1; PAID = 2; SHIPPED = 3; }
  Status status = 4;
}
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "resource": "Subscription",
  "operations": ["List", "Get", "Cancel", "Upgrade"],
  "format": "REST"
}
```

### Output Contract
```yaml
# OpenAPI 3.1 Spec Extract
paths:
  /v1/subscriptions:
    get:
      summary: List subscriptions with cursor pagination
      parameters:
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
        - name: starting_after
          in: query
          schema: { type: string }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { type: array, items: { $ref: '#/components/schemas/Subscription' } }
                  has_more: { type: boolean }
                  next_cursor: { type: string }
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Offset Pagination on Big Data**: Using `OFFSET 100000` causing database to scan and discard 100,000 rows.
- ❌ **HTTP Status Code Abuse**: Returning `200 OK` with `{ "error": "Unauthorized" }` inside the body.
- ❌ **Breaking Schema Changes**: Renaming fields in Protobuf or GraphQL without deprecation cycles and field numbering preservation.

---

## 6. Real-World Production Example

```markdown
**API Ergonomics Review**:
- Bad: `POST /api/cancelSubscription?id=123`
- Good: `POST /v1/subscriptions/sub_123/cancel` (Returns `200 OK` with updated status `canceled_pending_period_end`).
```
