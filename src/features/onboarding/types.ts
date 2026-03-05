export interface CatalogSkill {
	id: string;
	name: string;
	slug: string;
}

export interface CatalogInterest {
	id: string;
	name: string;
	slug: string;
	skills: CatalogSkill[];
}

export interface GetOnboardingCatalogResponse {
	interests: CatalogInterest[];
}
