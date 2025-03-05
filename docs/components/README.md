# Component Documentation

## Overview
This document outlines the reusable components available in the SentWatch platform.

## Component Categories

### Layout Components
- Header
- Sidebar
- Footer
- PageContainer

### Form Components
- Input
- Select
- DatePicker
- TimePicker
- FileUpload
- Button

### Data Display
- Table
- Card
- List
- Badge
- Status

### Dialog Components
- Modal
- Alert
- Confirmation
- Toast

### Navigation
- Tabs
- Breadcrumb
- Pagination
- Menu

### Charts
- LineChart
- BarChart
- PieChart
- Calendar

## Usage Guidelines

### Component Props
All components should:
- Use TypeScript interfaces for props
- Include proper documentation
- Have default props where appropriate
- Include proper validation

### Styling
- Use Tailwind CSS classes
- Follow design system tokens
- Support dark/light themes
- Be responsive by default

### Accessibility
- Include proper ARIA labels
- Support keyboard navigation
- Follow WCAG guidelines
- Include proper focus states

### State Management
- Use React hooks where appropriate
- Keep state minimal and focused
- Use context for shared state
- Handle loading/error states