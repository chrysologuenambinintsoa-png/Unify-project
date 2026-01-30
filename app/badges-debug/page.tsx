'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function BadgesTestPage() {
  const [badgesResult, setBadgesResult] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testBadgesAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/badges');
      const data = await response.json();
      setBadgesResult({
        status: response.status,
        statusText: response.statusText,
        data: data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test/badges');
      const data = await response.json();
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        <h1 className="text-3xl font-bold mb-6">Badges API Testing</h1>

        <div className="space-y-6">
          {/* Test Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testBadgesAPI}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              {loading ? 'Testing...' : 'Test /api/badges'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testDiagnostic}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              {loading ? 'Testing...' : 'Test Diagnostic'}
            </motion.button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3"
            >
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Badges API Result */}
          {badgesResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                {badgesResult.status === 200 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                )}
                <h2 className="text-xl font-bold">
                  /api/badges - Status {badgesResult.status}
                </h2>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                  {JSON.stringify(badgesResult, null, 2)}
                </pre>
              </div>

              {badgesResult.data?.success && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Friends</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {badgesResult.data.data.friends}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Messages</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {badgesResult.data.data.messages}
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Notifications</p>
                    <p className="text-2xl font-bold text-red-600">
                      {badgesResult.data.data.notifications}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Groups</p>
                    <p className="text-2xl font-bold text-green-600">
                      {badgesResult.data.data.groups}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pages</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {badgesResult.data.data.pages}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Diagnostic Result */}
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                {testResult.data?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                )}
                <h2 className="text-xl font-bold">
                  /api/test/badges - {testResult.data?.status}
                </h2>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">How to debug</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-900 text-sm">
            <li>Click "Test /api/badges" to test the main endpoint</li>
            <li>Click "Test Diagnostic" to check database connectivity</li>
            <li>Open DevTools (F12) → Network tab to see detailed requests</li>
            <li>
              Check the response status and data for errors
            </li>
            <li>If Database error, check your DATABASE_URL in .env</li>
            <li>If Unauthorized, make sure you're logged in</li>
          </ol>
        </div>
      </motion.div>
    </MainLayout>
  );
}
