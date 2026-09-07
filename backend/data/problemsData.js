// Problem Vault — 5-question series pull from this pool
export const problems = [
  {
    id: "p1",
    title: "Max Subarray",
    difficulty: "Easy",
    statement:
      "Given an integer array nums, find the contiguous subarray with the largest sum and return that sum.",
    starter: {
      javascript: "function maxSubArray(nums) {\n  // Write your code here\n}",
      python: "def max_sub_array(nums):\n    # Write your code here\n    pass",
      cpp: "int maxSubArray(vector<int>& nums) {\n    // Write your code here\n}",
      java: "public int maxSubArray(int[] nums) {\n    // Write your code here\n    return 0;\n}"
    },
    tests: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 }
    ]
  },
  {
    id: "p2",
    title: "Two Sum",
    difficulty: "Easy",
    statement:
      "Given an array of integers nums and a target, return indices of the two numbers that add up to target.",
    starter: {
      javascript: "function twoSum(nums, target) {\n  // Write your code here\n}",
      python: "def two_sum(nums, target):\n    # Write your code here\n    pass",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n}",
      java: "public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n    return new int[0];\n}"
    },
    tests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] }
    ]
  },
  {
    id: "p3",
    title: "Valid Parentheses",
    difficulty: "Easy",
    statement:
      "Given a string s containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    starter: {
      javascript: "function isValid(s) {\n  // Write your code here\n}",
      python: "def is_valid(s):\n    # Write your code here\n    pass",
      cpp: "bool isValid(string s) {\n    // Write your code here\n}",
      java: "public boolean isValid(String s) {\n    // Write your code here\n    return false;\n}"
    },
    tests: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false }
    ]
  },
  {
    id: "p4",
    title: "Reverse Linked List",
    difficulty: "Medium",
    statement: "Reverse a singly linked list and return the reversed list's head.",
    starter: {
      javascript: "function reverseList(head) {\n  // Write your code here\n}",
      python: "def reverse_list(head):\n    # Write your code here\n    pass",
      cpp: "ListNode* reverseList(ListNode* head) {\n    // Write your code here\n}",
      java: "public ListNode reverseList(ListNode head) {\n    // Write your code here\n    return null;\n}"
    },
    tests: [{ input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] }]
  },
  {
    id: "p5",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    statement: "Given a string s, return the longest palindromic substring in s.",
    starter: {
      javascript: "function longestPalindrome(s) {\n  // Write your code here\n}",
      python: "def longest_palindrome(s):\n    # Write your code here\n    pass",
      cpp: "string longestPalindrome(string s) {\n    // Write your code here\n}",
      java: "public String longestPalindrome(String s) {\n    // Write your code here\n    return \"\";\n}"
    },
    tests: [
      { input: ["babad"], expected: "bab" },
      { input: ["cbbd"], expected: "bb" }
    ]
  },
  {
    id: "p6",
    title: "Merge Intervals",
    difficulty: "Medium",
    statement: "Given an array of intervals, merge all overlapping intervals.",
    starter: {
      javascript: "function merge(intervals) {\n  // Write your code here\n}",
      python: "def merge(intervals):\n    # Write your code here\n    pass",
      cpp: "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    // Write your code here\n}",
      java: "public int[][] merge(int[][] intervals) {\n    // Write your code here\n    return new int[0][0];\n}"
    },
    tests: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] }
    ]
  }
];

export function getRandomFiveQuestionSeries() {
  const shuffled = [...problems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}
