export interface CatalogSkill {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

export interface CatalogInterest {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
	skills: CatalogSkill[];
}

export interface CatalogProfession {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

// Response Types
export interface FetchCatalogResponse {
	message: string;
	data: {
		professions: CatalogProfession[];
		interests: CatalogInterest[];
	};
}

export interface GetOnboardingCatalogResponse {
	message: string;
	data: {
		interests: CatalogInterest[];
	};
}

export interface GetProfessionsResponse {
	message: string;
	data: CatalogProfession[];
}

export interface CatalogIsActiveMutationResponse {
	message: string;
	data: {
		resourceId: string;
	};
}

// Input Types
export interface AddInterestInput {
	name: string;
}

export interface AddProfessionResponse {
	newProfessionId: string;
	slug: string;
}

export interface AddProfessionInput {
	name: string;
}
export interface AddInterestResponse {
	newInterestId: string;
	slug: string;
}

export interface AddSkillInput {
	name: string;
	interestId: string;
}

export interface AddSkillIResponse {
	newSkillId: string;
	interestId: string;
	slug: string;
}

export interface DisableInterestInput {
	interestId: string;
}

export interface DisableProfessionInput {
	professionId: string;
}

export interface DisableSkillInput {
	skillId: string;
}

export interface EnableInterestInput {
	interestId: string;
}

export interface EnableProfessionInput {
	professionId: string;
}

export interface EnableSkillInput {
	skillId: string;
}
