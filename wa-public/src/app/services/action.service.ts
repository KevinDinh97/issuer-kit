import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { StateService } from './state.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const apiUrl = '/api/';

export interface IInvitation {
  connection_id: string;
  invitation: Invitation;
  invitation_url: string;
}
export interface Invitation {
  '@type': string;
  '@id': string;
  serviceEndpoint: string;
  recipientKeys?: string[] | null;
  label: string;
}

export interface IConnectionResponse {
  invitation_mode: string;
  state: string;
  invitation_key: string;
  accept: string;
  routing_state: string;
  created_at: string;
  updated_at: string;
  connection_id: string;
  initiator: string;
}

export interface IssueCredential {
  claims: Claims;
  connectionId: string;
}
export interface Claims {
  userdisplayname: string;
  emailaddress: string;
  surname: string;
  givenname: string;
  birthdate: string;
  streetaddress: string;
  locality: string;
  stateorprovince: string;
  postalcode: string;
  country: string;
}

export interface IssueResponse {
  created_at: string;
  credential_proposal_dict: CredentialProposalDict;
  credential_definition_id: string;
  connection_id: string;
  state: string;
  auto_issue: boolean;
  updated_at: string;
  thread_id: string;
  schema_id: string;
  auto_offer: boolean;
  credential_exchange_id: string;
  credential_offer: CredentialOffer;
  initiator: string;
}
export interface CredentialProposalDict {
  '@type': string;
  '@id': string;
  cred_def_id: string;
  credential_proposal: CredentialProposal;
  comment: string;
}
export interface CredentialProposal {
  '@type': string;
  attributes?: AttributesEntity[] | null;
}
export interface AttributesEntity {
  name: string;
  value: string;
}
export interface CredentialOffer {
  schema_id: string;
  cred_def_id: string;
  key_correctness_proof: KeyCorrectnessProof;
  nonce: string;
}
export interface KeyCorrectnessProof {
  c: string;
  xz_cap: string;
  xr_cap?: (string[] | null)[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  _apiUrl: string;
  authenticate() {
    // TODO: @ES some authentication logic here
  }

  constructor(
    private keyCloakSvc: KeycloakService,
    private stateSvc: StateService,
    private http: HttpClient
  ) {
    this._apiUrl = apiUrl;
    this.keyCloakSvc
      .loadUserProfile()
      .then((res: Keycloak.KeycloakProfile) => (this.stateSvc.user = res));
  }

  logout() {
    this.keyCloakSvc.logout();
  }

  getInvitation() {
    return this.http.get<IInvitation>(`${this._apiUrl}connections`);
  }

  getConnectionState(id: string) {
    return this.http.get<IConnectionResponse>(
      `${this._apiUrl}connections/${id}`
    );
  }

  issueCredentials(data: IssueCredential) {
    console.log('data', data);
    return this.http.post<IssueResponse>(`${this._apiUrl}issues/`, data);
  }
}
