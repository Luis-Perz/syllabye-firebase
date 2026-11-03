import { TestEmailEventInsertData, ListDepartmentsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useTestEmailEventInsert(options?: useDataConnectMutationOptions<TestEmailEventInsertData, FirebaseError, void>): UseDataConnectMutationResult<TestEmailEventInsertData, undefined>;
export function useTestEmailEventInsert(dc: DataConnect, options?: useDataConnectMutationOptions<TestEmailEventInsertData, FirebaseError, void>): UseDataConnectMutationResult<TestEmailEventInsertData, undefined>;

export function useListDepartments(options?: useDataConnectQueryOptions<ListDepartmentsData>): UseDataConnectQueryResult<ListDepartmentsData, undefined>;
export function useListDepartments(dc: DataConnect, options?: useDataConnectQueryOptions<ListDepartmentsData>): UseDataConnectQueryResult<ListDepartmentsData, undefined>;
