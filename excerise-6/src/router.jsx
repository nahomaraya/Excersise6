import { createRootRoute, createRoute, createRouter, Outlet, Link } from '@tanstack/react-router'
import FormBuilder from './components/FormBuilder'
import FormPreview from './components/FormPreview'
import { FormProvider, useForm } from './formContext'
import './App.css'

function RootLayout() {
  return (
    <FormProvider>
      <div className="fb-app">
        <header className="fb-header">
          <div className="fb-header-brand">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect width="30" height="30" rx="6" fill="#673ab7" />
              <rect x="7" y="7" width="16" height="3" rx="1.5" fill="white" />
              <rect x="7" y="13" width="16" height="3" rx="1.5" fill="white" />
              <rect x="7" y="19" width="10" height="3" rx="1.5" fill="white" />
            </svg>
            <span>Form Builder</span>
          </div>
          <nav className="fb-header-nav">
            <Link
              to="/"
              className="fb-nav-tab"
              activeProps={{ className: 'fb-nav-tab active' }}
              activeOptions={{ exact: true }}
            >
              Builder
            </Link>
            <Link
              to="/preview"
              className="fb-nav-tab"
              activeProps={{ className: 'fb-nav-tab active' }}
            >
              Preview
            </Link>
          </nav>
        </header>
        <main className="fb-main">
          <Outlet />
        </main>
      </div>
    </FormProvider>
  )
}

function BuilderPage() {
  const { form, setForm, addQuestion, updateQuestion, deleteQuestion, duplicateQuestion, moveQuestion } = useForm()
  return (
    <FormBuilder
      form={form}
      setForm={setForm}
      addQuestion={addQuestion}
      updateQuestion={updateQuestion}
      deleteQuestion={deleteQuestion}
      duplicateQuestion={duplicateQuestion}
      moveQuestion={moveQuestion}
    />
  )
}

function PreviewPage() {
  const { form, onSubmit } = useForm()
  return <FormPreview form={form} onSubmit={onSubmit} />
}

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: BuilderPage,
})

const previewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/preview',
  component: PreviewPage,
})

const routeTree = rootRoute.addChildren([indexRoute, previewRoute])

export const router = createRouter({ routeTree })
