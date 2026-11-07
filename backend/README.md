# Backend

## Arquitectura

Para hacer este proyecto se decidió utilizar la arquitectura limpia siguiendo el marco teórico propuesto por Martin en su libro "Clean Architecture: A Craftsman’s Guide to Software Structure and Design", organizando el código en cuatro círculos concéntricos:

1. Domain
2. Application
3. Interfaces
4. Infrastructure

Con esta selleción se pretendía lograr la separación de responsabilidades, la independencia de las reglas de negocio respecto a frameworks y tecnologías, un bajo acoplamiento entre componentes, facilidad para sustituir implementaciones externas y mayor facilidad para probar los casos de uso. Así, las reglas de negocio no dependen de Express, Prisma o PostgreSQL.

### Breve explicación de las capas

#### Domain

Su responsabilidad es representar los conceptos fundamentales del negocio y sus reglas, independientemente de la infraestructura.

#### Application

Se encarga de coordinar las operaciones del sistema y aplicar las reglas necesarias para ejecutar y aplicar las reglas necesarias para ejecutar cada caso de uso.

#### Interfaces

Adapatan los datos de entrada y salida para que los componentes externos puedan comunicarse con los casos de uso (Application).

Los controllers reciben y procesan las solicitudes, los presenters construyen las respuestas que se devolverán al cliente, los gateways implementan los contratos de acceso definidos por Application y los Data Sources definen las operaciones de acceso a los datos que necesitan los adaptadores de persistencia.

## Patrones usados hasta el momento

### Utilizados

- Adapter: Se usa en los adaptadores que conectan los contratos internos con tecnologías externas.
- Template Method: Se usa en TargetUserController, que define el procedimiento general de atención de una petición y delega un paso variable en las subclases mediante el método abstracti run().
- Data Mapper: Se realizan transformaciones explícitas entre los registros de Prisma, los registros intermedios y las entidades que utilizan la aplicación.
