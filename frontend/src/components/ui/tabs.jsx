import { useState } from "react";

export function Tabs({ defaultValue, className = "", children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const enhancedChildren = Array.isArray(children)
    ? children.map((child) => {
        if (child.type === TabsList) {
          return { ...child, props: { ...child.props, activeTab, setActiveTab } };
        }
        if (child.type === TabsContent) {
          return { ...child, props: { ...child.props, activeTab } };
        }
        return child;
      })
    : children;

  return (
    <div className={className}>
      {enhancedChildren}
    </div>
  );
}

export function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2">
      {Array.isArray(children) &&
        children.map((child) =>
          child.type === TabsTrigger
            ? {
                ...child,
                props: {
                  ...child.props,
                  isActive: child.props.value === activeTab,
                  onClick: () => setActiveTab(child.props.value),
                },
              }
            : child
        )}
    </div>
  );
}

export function TabsTrigger({ value, children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, children }) {
  return value === activeTab ? <div className="mt-4">{children}</div> : null;
}
