/**
 * Artifact Metadata Deployment Record
 */
export type artifact_deployment_record = {
  id?: number;
  digest?: string;
  logical_environment?: string;
  physical_environment?: string;
  cluster?: string;
  deployment_name?: string;
  tags?: { [key: string]: string };
  /**
   * A list of runtime risks associated with the deployment.
   */
  runtime_risks?: Array<
    | "critical-resource"
    | "internet-exposed"
    | "lateral-movement"
    | "sensitive-data"
  >;
  created_at?: string;
  updated_at?: string;
  /**
   * The ID of the provenance attestation associated with the deployment record.
   */
  attestation_id?: number;
};
