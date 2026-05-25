import type { Context$ } from "../types/_.context.js";
import type { Order } from "../types/components/schemas/Order.js";
import type { Pet } from "../types/components/schemas/Pet.js";
import type { User } from "../types/components/schemas/User.js";

/**
 * This is the default context for Counterfact.
 *
 * It defines the context object in the REPL
 * and the $.context object in the code.
 *
 * Add properties and methods to suit your needs.
 *
 * See https://github.com/counterfact/api-simulator/blob/main/docs/features/state.md
 */

export class Context {
  public petsById = new Map<number, Pet>();
  public ordersById = new Map<number, Order>();
  public usersByUsername = new Map<string, User>();
  private nextPetId = 1;
  private nextOrderId = 1;
  private nextUserId = 1;

  constructor($: Context$) {
    void $;
  }

  savePet(pet: Pet): Pet {
    const id = pet.id ?? this.nextPetId;
    const normalizedPet = {
      status: "available" as const,
      ...pet,
      id,
    };
    this.petsById.set(id, normalizedPet);
    this.nextPetId = Math.max(this.nextPetId, id + 1);
    return normalizedPet;
  }

  saveOrder(order: Order): Order {
    const id = order.id ?? this.nextOrderId;
    const normalizedOrder = {
      ...order,
      id,
    };
    this.ordersById.set(id, normalizedOrder);
    this.nextOrderId = Math.max(this.nextOrderId, id + 1);
    return normalizedOrder;
  }

  saveUser(user: User): User {
    const id = user.id ?? this.nextUserId;
    const username = user.username ?? `user-${id}`;
    const normalizedUser = {
      ...user,
      id,
      username,
    };
    this.usersByUsername.set(username, normalizedUser);
    this.nextUserId = Math.max(this.nextUserId, id + 1);
    return normalizedUser;
  }
}
