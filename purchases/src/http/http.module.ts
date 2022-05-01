import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';

import { DatabaseModule } from '../database/database.module';
import { CustomersResolver } from './graphQl/resolvers/customers.resolver';
import { ProductsResolver } from './graphQl/resolvers/products.resolver';
import { PurchasesResolver } from './graphQl/resolvers/purchases.resolver';
import { CustomersService } from './services/customers.service';
import { ProductsService } from './services/products.service';
import { PurchasesService } from './services/purchases.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    //Resolvers
    PurchasesResolver,
    ProductsResolver,
    CustomersResolver,
    //Services
    ProductsService,
    PurchasesService,
    CustomersService,
  ],
})
export class HttpModule {}
