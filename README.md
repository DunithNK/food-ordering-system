# Online Food Ordering System - Microservices MVP

## Group Members & Services
| Member | Service | Port |
|--------|---------|------|
| Kaveesha | User Service | 8081 |
| Naveen | Restaurant Service | 8082 |
| Dunith | Order Service | 8083 |
| Yasas | Payment Service | 8084 |
| (Shared) | API Gateway | 8080 |

## How to Run
1. Open 5 terminals in VS Code
2. In each terminal, cd into the service folder and run `npm install` then `npm start`
3. Access everything via Gateway on port 8080

## Swagger Docs
- User Service: http://localhost:8081/api-docs
- Restaurant Service: http://localhost:8082/api-docs
- Order Service: http://localhost:8083/api-docs
- Payment Service: http://localhost:8084/api-docs
- Via Gateway: http://localhost:8080/{service}/api-docs
