import { Result } from "neverthrow";
import { Budget } from "../../model/budget";
import { Id } from "../../model/types";
import { RepositoryError } from "../types";

export interface BudgetRepository {
  save: (budget: Budget) => Result<boolean, RepositoryError>;
  remove: (id: Id) => Result<Id, RepositoryError>;
  findById: (id: Id) => Result<Budget, RepositoryError>;
}

export class BudgetRepository {
  #repo: BudgetRepository;

  constructor(repo: BudgetRepository) {
    this.#repo = repo;
  }
  
}
