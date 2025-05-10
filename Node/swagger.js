const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'School Vaccination Portal API',
        version: '1.0.0',
        description: 'API documentation for the student vaccination portal',
      },
      servers: [
        {
          url: 'http://localhost:5000/api',
        },
      ],
      components: {
        schemas: {
          Student: {
            type: 'object',
            required: ['name', 'studentId', 'class', 'grade', 'age', 'gender', 'parentName', 'contactNumber'],
            properties: {
              name: { type: 'string' },
              studentId: { type: 'string' },
              class: { type: 'string' },
              grade: { type: 'string' },
              age: { type: 'integer' },
              gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
              parentName: { type: 'string' },
              contactNumber: { type: 'string' },
              vaccinations: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    vaccineId: { type: 'string' },
                    vaccineName: { type: 'string' },
                    dateAdministered: { type: 'string', format: 'date' },
                    status: { type: 'string', enum: ['Pending', 'Completed', 'Missed'] }
                  }
                }
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    apis: ['./routes/api/*.js'],
  };
  