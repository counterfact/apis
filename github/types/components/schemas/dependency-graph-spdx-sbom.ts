/**
 * A schema for the SPDX JSON format returned by the Dependency Graph.
 */
export type dependency_graph_spdx_sbom = {
  sbom: {
    /**
     * The SPDX identifier for the SPDX document.
     * @example "SPDXRef-DOCUMENT"
     */
    SPDXID: string;
    /**
     * The version of the SPDX specification that this document conforms to.
     * @example "SPDX-2.3"
     */
    spdxVersion: string;
    /**
     * An optional comment about the SPDX document.
     * @example "Exact versions could not be resolved for some packages. For more information: https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/"
     */
    comment?: string;
    creationInfo: {
      /**
       * The date and time the SPDX document was created.
       * @example "2021-11-03T00:00:00Z"
       */
      created: string;
      /**
       * The tools that were used to generate the SPDX document.
       */
      creators: Array<string>;
    };
    /**
     * The name of the SPDX document.
     * @example "github/github"
     */
    name: string;
    /**
     * The license under which the SPDX document is licensed.
     * @example "CC0-1.0"
     */
    dataLicense: string;
    /**
     * The namespace for the SPDX document.
     * @example "https://spdx.org/spdxdocs/protobom/15e41dd2-f961-4f4d-b8dc-f8f57ad70d57"
     */
    documentNamespace: string;
    packages: Array<{
      /**
       * A unique SPDX identifier for the package.
       * @example "SPDXRef-Package"
       */
      SPDXID?: string;
      /**
       * The name of the package.
       * @example "github/github"
       */
      name?: string;
      /**
       * The version of the package. If the package does not have an exact version specified,
       * a version range is given.
       * @example "1.0.0"
       */
      versionInfo?: string;
      /**
       * The location where the package can be downloaded,
       * or NOASSERTION if this has not been determined.
       * @example "NOASSERTION"
       */
      downloadLocation?: string;
      /**
       * Whether the package's file content has been subjected to
       * analysis during the creation of the SPDX document.
       * @example false
       */
      filesAnalyzed?: boolean;
      /**
       * The license of the package as determined while creating the SPDX document.
       * @example "MIT"
       */
      licenseConcluded?: string;
      /**
       * The license of the package as declared by its author, or NOASSERTION if this information
       * was not available when the SPDX document was created.
       * @example "NOASSERTION"
       */
      licenseDeclared?: string;
      /**
       * The distribution source of this package, or NOASSERTION if this was not determined.
       * @example "NOASSERTION"
       */
      supplier?: string;
      /**
       * The copyright holders of the package, and any dates present with those notices, if available.
       * @example "Copyright (c) 1985 GitHub.com"
       */
      copyrightText?: string;
      externalRefs?: Array<{
        /**
         * The category of reference to an external resource this reference refers to.
         * @example "PACKAGE-MANAGER"
         */
        referenceCategory: string;
        /**
         * A locator for the particular external resource this reference refers to.
         * @example "pkg:gem/rails@6.0.1"
         */
        referenceLocator: string;
        /**
         * The category of reference to an external resource this reference refers to.
         * @example "purl"
         */
        referenceType: string;
      }>;
    }>;
    relationships?: Array<{
      /**
       * The type of relationship between the two SPDX elements.
       * @example "DEPENDS_ON"
       */
      relationshipType?: string;
      /**
       * The SPDX identifier of the package that is the source of the relationship.
       */
      spdxElementId?: string;
      /**
       * The SPDX identifier of the package that is the target of the relationship.
       */
      relatedSpdxElement?: string;
    }>;
  };
};
