import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Administrator_Key {
  id: UUIDString;
  __typename?: 'Administrator_Key';
}

export interface Course_Key {
  id: UUIDString;
  __typename?: 'Course_Key';
}

export interface Department_Key {
  code: string;
  __typename?: 'Department_Key';
}

export interface EmailEvent_Key {
  id: UUIDString;
  __typename?: 'EmailEvent_Key';
}

export interface ListDepartmentsData {
  departments: ({
    code: string;
    name: string;
  } & Department_Key)[];
}

export interface Professor_Key {
  id: UUIDString;
  __typename?: 'Professor_Key';
}

export interface SectionCode_Key {
  code: string;
  __typename?: 'SectionCode_Key';
}

export interface Section_Key {
  id: UUIDString;
  __typename?: 'Section_Key';
}

export interface Semester_Key {
  name: string;
  __typename?: 'Semester_Key';
}

export interface StaffAccount_Key {
  id: UUIDString;
  __typename?: 'StaffAccount_Key';
}

export interface SyllabusVersion_Key {
  id: UUIDString;
  __typename?: 'SyllabusVersion_Key';
}

export interface TestEmailEventInsertData {
  emailEvent_upsert: EmailEvent_Key;
}

interface TestEmailEventInsertRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<TestEmailEventInsertData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<TestEmailEventInsertData, undefined>;
  operationName: string;
}
export const testEmailEventInsertRef: TestEmailEventInsertRef;

export function testEmailEventInsert(): MutationPromise<TestEmailEventInsertData, undefined>;
export function testEmailEventInsert(dc: DataConnect): MutationPromise<TestEmailEventInsertData, undefined>;

interface ListDepartmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDepartmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListDepartmentsData, undefined>;
  operationName: string;
}
export const listDepartmentsRef: ListDepartmentsRef;

export function listDepartments(options?: ExecuteQueryOptions): QueryPromise<ListDepartmentsData, undefined>;
export function listDepartments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDepartmentsData, undefined>;

