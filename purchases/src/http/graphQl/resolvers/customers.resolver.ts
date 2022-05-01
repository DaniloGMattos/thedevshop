import { UseGuards } from '@nestjs/common';
import { Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { Customer } from '../models/customer';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomersService } from '../../services/customers.service';
import { PurchasesService } from '../../services/purchases.service';
import { Purchase } from '../models/purchase';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(
    private customersService: CustomersService,
    private purchasesService: PurchasesService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => Customer)
  me(@CurrentUser() user: AuthUser) {
    return this.customersService.getCustomerByAuthUserId(user.sub);
  }
  @ResolveField(() => Purchase)
  purchases(@Parent() customer: Customer) {
    return this.purchasesService.listAllFromCustomer(customer.id);
  }
}
