'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  FolderOpen,
  FileVideo,
  Plus,
  ChevronDown,
  ChevronRight,
  LayoutList,
  Pencil,
} from 'lucide-react';
import { type Lang } from '@/lib/i18n';

export function CurriculumBuilder({
  programId,
  lang,
}: {
  programId: string;
  lang: Lang;
}) {
  const isFr = lang === 'fr';
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for inline creation forms
  const [addingCourse, setAddingCourse] = useState(false);
  const [addingModuleTo, setAddingModuleTo] = useState<string | null>(null);
  const [addingLessonTo, setAddingLessonTo] = useState<{
    courseId: string;
    moduleId: string | null;
  } | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLessonData, setEditLessonData] = useState({
    title_fr: '',
    title_ar: '',
    content_url: '',
    duration_minutes: '',
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editLang, setEditLang] = useState<'fr' | 'ar'>(isFr ? 'fr' : 'ar');

  const fetchData = async () => {
    setIsLoading(true);
    // Fetch all courses for this program
    const { data: coursesData } = await supabase
      .from('courses')
      .select('*')
      .eq('program_id', programId)
      .order('order_index');
    if (coursesData) {
      setCourses(coursesData);
      const courseIds = coursesData.map((c) => c.id);

      if (courseIds.length > 0) {
        // Fetch modules and lessons related to these courses
        const [{ data: modulesData }, { data: lessonsData }] =
          await Promise.all([
            supabase
              .from('course_modules')
              .select('*')
              .in('course_id', courseIds)
              .order('order_index'),
            supabase
              .from('lessons')
              .select('*')
              .in('course_id', courseIds)
              .order('order_index'),
          ]);
        if (modulesData) setModules(modulesData);
        if (lessonsData) setLessons(lessonsData);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [programId, supabase]);

  const handleAddItem = async (type: 'course' | 'module' | 'lesson') => {
    if (!newItemTitle.trim()) return;
    setIsSubmitting(true);

    try {
      if (type === 'course') {
        await supabase.from('courses').insert({
          program_id: programId,
          title_fr: newItemTitle,
          title_ar: newItemTitle, // Defaulting both to same for quick creation
          order_index: courses.length,
        });
        setAddingCourse(false);
      } else if (type === 'module' && addingModuleTo) {
        await supabase.from('course_modules').insert({
          course_id: addingModuleTo,
          title_fr: newItemTitle,
          title_ar: newItemTitle,
          order_index: modules.filter((m) => m.course_id === addingModuleTo)
            .length,
        });
        setAddingModuleTo(null);
      } else if (type === 'lesson' && addingLessonTo) {
        await supabase.from('lessons').insert({
          course_id: addingLessonTo.courseId,
          module_id: addingLessonTo.moduleId,
          title_fr: newItemTitle,
          title_ar: newItemTitle,
          type: 'video',
          order_index: lessons.filter(
            (l) => l.module_id === addingLessonTo.moduleId,
          ).length,
        });
        setAddingLessonTo(null);
      }
      setNewItemTitle('');
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLessonId) return;
    setIsSubmitting(true);
    try {
      await supabase
        .from('lessons')
        .update({
          title_fr: editLessonData.title_fr,
          title_ar: editLessonData.title_ar,
          content_url: editLessonData.content_url,
          duration_minutes: editLessonData.duration_minutes
            ? parseInt(editLessonData.duration_minutes, 10)
            : null,
          published: editLessonData.published,
        })
        .eq('id', editingLessonId);

      setEditingLessonId(null);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Translation Switcher */}
      <div className="flex justify-end mb-2">
        <div className="inline-flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setEditLang('fr')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${editLang === 'fr' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Français
          </button>
          <button
            onClick={() => setEditLang('ar')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${editLang === 'ar' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            العربية
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <LayoutList className="w-16 h-16 text-indigo-200 dark:text-indigo-800 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isFr ? 'Votre curriculum est vide' : 'منهجك فارغ'}
          </h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            {isFr
              ? 'Commencez par ajouter votre premier cours pour structurer votre programme.'
              : 'ابدأ بإضافة دورتك الأولى لتنظيم برنامجك.'}
          </p>
          {!addingCourse ? (
            <Button
              onClick={() => setAddingCourse(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />{' '}
              {isFr ? 'Ajouter un Cours' : 'إضافة دورة'}
            </Button>
          ) : (
            <div className="max-w-md mx-auto flex gap-2 px-4">
              <input
                autoFocus
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder={isFr ? 'Titre du cours...' : 'عنوان الدورة...'}
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Button
                onClick={() => handleAddItem('course')}
                disabled={isSubmitting}
              >
                {isFr ? 'Ajouter' : 'إضافة'}
              </Button>
              <Button variant="ghost" onClick={() => setAddingCourse(false)}>
                {isFr ? 'Annuler' : 'إلغاء'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              {/* Course Header */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editLang === 'fr' ? course.title_fr : course.title_ar}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddingModuleTo(course.id)}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  <Plus className="w-4 h-4 mr-1" />{' '}
                  {isFr ? 'Nouveau Module' : 'وحدة جديدة'}
                </Button>
              </div>

              <div className="p-4 space-y-4">
                {/* Inline Add Module */}
                {addingModuleTo === course.id && (
                  <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg ml-6">
                    <input
                      autoFocus
                      type="text"
                      dir={editLang === 'ar' ? 'rtl' : 'ltr'}
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder={
                        editLang === 'fr'
                          ? 'Titre du module...'
                          : 'عنوان الوحدة...'
                      }
                      className="flex-1 px-3 py-1 text-sm border rounded bg-white dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddItem('module')}
                      disabled={isSubmitting}
                    >
                      {isFr ? 'Ajouter' : 'إضافة'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAddingModuleTo(null)}
                    >
                      {isFr ? 'Annuler' : 'إلغاء'}
                    </Button>
                  </div>
                )}

                {/* Modules List */}
                {modules
                  .filter((m) => m.course_id === course.id)
                  .map((module) => (
                    <div
                      key={module.id}
                      className="ml-6 border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-3"
                    >
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                          <FolderOpen className="w-4 h-4 text-slate-400" />
                          {editLang === 'fr'
                            ? module.title_fr
                            : module.title_ar}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setAddingLessonTo({
                              courseId: course.id,
                              moduleId: module.id,
                            })
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs text-slate-500 hover:text-indigo-600"
                        >
                          <Plus className="w-3 h-3 mr-1" />{' '}
                          {isFr ? 'Leçon' : 'درس'}
                        </Button>
                      </div>

                      {/* Inline Add Lesson */}
                      {addingLessonTo?.moduleId === module.id && (
                        <div className="flex gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded ml-6">
                          <input
                            autoFocus
                            type="text"
                            dir={editLang === 'ar' ? 'rtl' : 'ltr'}
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            placeholder={
                              editLang === 'fr'
                                ? 'Titre de la leçon...'
                                : 'عنوان الدرس...'
                            }
                            className="flex-1 px-2 py-1 text-sm border rounded bg-white dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                          />
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleAddItem('lesson')}
                            disabled={isSubmitting}
                          >
                            {isFr ? 'Ajouter' : 'إضافة'}
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            variant="ghost"
                            onClick={() => setAddingLessonTo(null)}
                          >
                            {isFr ? 'Annuler' : 'إلغاء'}
                          </Button>
                        </div>
                      )}

                      {/* Lessons List */}
                      <div className="ml-4 space-y-2">
                        {lessons
                          .filter((l) => l.module_id === module.id)
                          .map((lesson) => (
                            <div key={lesson.id} className="relative">
                              {editingLessonId === lesson.id ? (
                                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg ml-6 space-y-3">
                                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                    {isFr ? 'Modifier la leçon' : 'تعديل الدرس'}
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">
                                      {editLang === 'fr'
                                        ? 'Titre de la leçon'
                                        : 'عنوان الدرس'}
                                    </label>
                                    <input
                                      type="text"
                                      dir={editLang === 'ar' ? 'rtl' : 'ltr'}
                                      value={
                                        editLang === 'fr'
                                          ? editLessonData.title_fr
                                          : editLessonData.title_ar
                                      }
                                      onChange={(e) =>
                                        setEditLessonData((prev) =>
                                          editLang === 'fr'
                                            ? {
                                                ...prev,
                                                title_fr: e.target.value,
                                              }
                                            : {
                                                ...prev,
                                                title_ar: e.target.value,
                                              },
                                        )
                                      }
                                      className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                  </div>
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-slate-500">
                                        {isFr
                                          ? 'URL de la vidéo'
                                          : 'رابط الفيديو'}
                                      </label>
                                      <input
                                        type="url"
                                        value={editLessonData.content_url}
                                        onChange={(e) =>
                                          setEditLessonData({
                                            ...editLessonData,
                                            content_url: e.target.value,
                                          })
                                        }
                                        placeholder="https://..."
                                        className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-slate-500">
                                        {isFr
                                          ? 'Durée (minutes)'
                                          : 'المدة (دقائق)'}
                                      </label>
                                      <input
                                        type="number"
                                        value={editLessonData.duration_minutes}
                                        onChange={(e) =>
                                          setEditLessonData({
                                            ...editLessonData,
                                            duration_minutes: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                                      />
                                    </div>
                                  </div>

                                  {/* Publish Toggle */}
                                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <input
                                      type="checkbox"
                                      id={`publish-${lesson.id}`}
                                      checked={editLessonData.published}
                                      onChange={(e) =>
                                        setEditLessonData({
                                          ...editLessonData,
                                          published: e.target.checked,
                                        })
                                      }
                                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600"
                                    />
                                    <label
                                      htmlFor={`publish-${lesson.id}`}
                                      className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                                    >
                                      {editLang === 'fr'
                                        ? 'Publier cette leçon'
                                        : 'نشر هذا الدرس'}
                                    </label>
                                  </div>

                                  <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingLessonId(null)}
                                    >
                                      {isFr ? 'Annuler' : 'إلغاء'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={handleSaveLesson}
                                      disabled={isSubmitting}
                                    >
                                      {isFr ? 'Enregistrer' : 'حفظ'}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                                      <FileVideo
                                        className={`w-4 h-4 ${lesson.published ? 'text-emerald-500' : 'text-slate-400'}`}
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span
                                        className={`text-sm font-medium ${lesson.published ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 line-through'}`}
                                      >
                                        {editLang === 'fr'
                                          ? lesson.title_fr
                                          : lesson.title_ar}
                                      </span>
                                      {!lesson.published && (
                                        <span className="text-[10px] text-amber-500 uppercase tracking-wider font-bold">
                                          {isFr ? 'Brouillon' : 'مسودة'}
                                        </span>
                                      )}
                                    </div>
                                    {lesson.duration_minutes && (
                                      <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                        {lesson.duration_minutes} min
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      setEditingLessonId(lesson.id);
                                      setEditLessonData({
                                        title_fr: lesson.title_fr || '',
                                        title_ar: lesson.title_ar || '',
                                        content_url: lesson.content_url || '',
                                        duration_minutes:
                                          lesson.duration_minutes
                                            ? String(lesson.duration_minutes)
                                            : '',
                                        published: lesson.published || false,
                                      });
                                    }}
                                  >
                                    <Pencil className="w-4 h-4 text-slate-500" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        {lessons.filter((l) => l.module_id === module.id)
                          .length === 0 &&
                          addingLessonTo?.moduleId !== module.id && (
                            <div className="text-xs text-slate-400 italic py-1 ml-2">
                              {isFr
                                ? 'Aucune leçon dans ce module.'
                                : 'لا يوجد دروس في هذه الوحدة.'}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}

                {modules.filter((m) => m.course_id === course.id).length ===
                  0 &&
                  addingModuleTo !== course.id && (
                    <div className="text-sm text-slate-500 text-center py-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 ml-6">
                      {isFr
                        ? 'Ce cours est vide. Ajoutez un module pour commencer.'
                        : 'هذه الدورة فارغة. أضف وحدة للبدء.'}
                    </div>
                  )}
              </div>
            </Card>
          ))}

          {/* Add Another Course Button */}
          {!addingCourse ? (
            <Button
              variant="outline"
              onClick={() => setAddingCourse(true)}
              className="w-full border-dashed border-2 py-8 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-800 bg-transparent hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
            >
              <Plus className="w-5 h-5 mr-2" />{' '}
              {isFr ? 'Ajouter un autre cours' : 'إضافة دورة أخرى'}
            </Button>
          ) : (
            <Card className="p-4 border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10">
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder={isFr ? 'Titre du cours...' : 'عنوان الدورة...'}
                  className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-slate-950 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Button
                  onClick={() => handleAddItem('course')}
                  disabled={isSubmitting}
                >
                  {isFr ? 'Ajouter' : 'إضافة'}
                </Button>
                <Button variant="ghost" onClick={() => setAddingCourse(false)}>
                  {isFr ? 'Annuler' : 'إلغاء'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
