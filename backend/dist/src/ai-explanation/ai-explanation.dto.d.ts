declare class ProjectionDataDto {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
}
export declare class AiExplanationRequestDto {
    risk_profile: string;
    allocation: Record<string, number>;
    capital_distribution: Record<string, number>;
    projection: ProjectionDataDto;
    time_horizon: number;
    monthly_contribution?: number;
    risk_tolerance: string;
    liquidity_need: string;
    explanation_type?: string;
}
export declare class AiExplanationResponseDto {
    explanation: string;
    type: string;
    generated_at: Date;
    model: string;
}
export {};
